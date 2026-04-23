import { useCallback, useEffect, useRef, useState } from "react";
import { getBotResponse } from "../data/chatKnowledgeBase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_HISTORY_KEY = "prydo_chat_history";
const STORAGE_ONBOARD_KEY = "prydo_onboarding_shown";
const MAX_HISTORY = 50;

const ONBOARDING_STEPS = [
  {
    emoji: "🏳️‍🌈",
    text: "Welcome to Prydo — the LGBTQ+ Web3 identity platform!",
  },
  {
    emoji: "🔗",
    text: "Connect your wallet using Internet Identity, MetaMask, or WalletConnect (300+ wallets).",
  },
  {
    emoji: "🔍",
    text: "Complete AI-powered KYC with your Passport or National ID + a quick liveness check.",
  },
  {
    emoji: "🪙",
    text: "Mint your soulbound Prydo ID — Genesis, Standard, or Basic tier.",
  },
  {
    emoji: "💜",
    text: "I'm here 24/7 for help, LGBTQ+ resources, and crisis support. Just ask!",
  },
];

const SUGGESTION_CHIPS = [
  "How to mint?",
  "KYC help",
  "Wallet connect",
  "Crisis support",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{
      id: string;
      role: "user" | "bot";
      text: string;
      timestamp: string;
    }>;
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]): void {
  try {
    const toSave = messages.slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage quota exceeded — silently skip
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uid(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Onboarding Slide ─────────────────────────────────────────────────────────

function OnboardingSlide({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <div className="flex flex-col h-full">
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 pt-4 pb-2">
        {ONBOARDING_STEPS.map((_, idx) => (
          <span
            key={ONBOARDING_STEPS[idx].emoji}
            className="block rounded-full transition-all duration-300"
            style={{
              width: idx === step ? "20px" : "8px",
              height: "8px",
              background:
                idx <= step
                  ? "linear-gradient(90deg, #ff4fd8, #8b5cf6)"
                  : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{
            background: "rgba(139,92,246,0.2)",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
          role="img"
          aria-label={current.text}
        >
          {current.emoji}
        </div>
        <p className="text-foreground text-sm leading-relaxed font-medium">
          {current.text}
        </p>
      </div>

      {/* Buttons */}
      <div className="px-5 pb-5 flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Back
          </button>
        )}
        <button
          type="button"
          data-ocid="chat.onboarding_next_button"
          onClick={() => {
            if (isLast) {
              onDone();
            } else {
              setStep((s) => s + 1);
            }
          }}
          className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all btn-gradient text-white"
          style={{ boxShadow: "0 0 16px rgba(255,79,216,0.3)" }}
        >
          {isLast ? "Got it! 🎉" : "Next →"}
        </button>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[80%]">
          <div
            className="px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed"
            style={{
              background: "linear-gradient(135deg, #ff4fd8 0%, #8b5cf6 100%)",
            }}
          >
            {msg.text}
          </div>
          <p
            className="text-right text-[10px] mt-1 opacity-50"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {formatTime(msg.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  // Bot message — render inline bold (**text**) formatting
  const lines = msg.text.split("\n");

  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[90%]">
        <div
          className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
          style={{
            background: "rgba(20,10,40,0.7)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderLeft: "3px solid #8b5cf6",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {lines.map((line, lineIdx) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            // Use stable composite keys derived from content + position
            const lineKey = `l${lineIdx}`;
            return (
              <p key={lineKey} className={lineIdx > 0 ? "mt-1" : ""}>
                {parts.map((part, partIdx) => {
                  const partKey = `${lineKey}p${partIdx}`;
                  return partIdx % 2 === 1 ? (
                    <strong key={partKey} style={{ color: "#c084fc" }}>
                      {part}
                    </strong>
                  ) : (
                    <span key={partKey}>{part}</span>
                  );
                })}
              </p>
            );
          })}
        </div>
        <p
          className="text-[10px] mt-1 opacity-50"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {formatTime(msg.timestamp)}
        </p>
      </div>
    </div>
  );
}

// ─── Main ChatWidget ──────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageCount = messages.length;

  // Load history on mount
  useEffect(() => {
    const history = loadHistory();
    setMessages(history);
  }, []);

  // Show onboarding on first open
  useEffect(() => {
    if (!isOpen) return;

    const shown = localStorage.getItem(STORAGE_ONBOARD_KEY);
    if (!shown) {
      setShowOnboarding(true);
    } else if (messageCount === 0) {
      const welcome: ChatMessage = {
        id: uid(),
        role: "bot",
        text: "🏳️‍🌈 **Welcome to Prydo Support!**\n\nAsk me anything — wallet connection, minting, KYC, LGBTQ+ rights, or crisis support. I'm here 24/7!\n\n*Aap Hindi mein bhi pooch sakte hain.* 😊",
        timestamp: new Date(),
      };
      setMessages([welcome]);
      saveHistory([welcome]);
    }
    setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen, messageCount]);

  // Scroll helper — stable ref-based, no deps needed
  const scrollToBottom = useCallback(() => {
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }, []);

  // Scroll on open
  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, scrollToBottom]);

  function handleOnboardingDone() {
    localStorage.setItem(STORAGE_ONBOARD_KEY, "true");
    setShowOnboarding(false);

    const welcome: ChatMessage = {
      id: uid(),
      role: "bot",
      text: "🏳️‍🌈 **You're all set! Welcome to Prydo.**\n\nAsk me anything — I speak English aur Hindi dono mein! 😊\n\nWhat would you like to know?",
      timestamp: new Date(),
    };
    setMessages([welcome]);
    saveHistory([welcome]);
    setTimeout(() => inputRef.current?.focus(), 200);
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBotTyping) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveHistory(newMessages);
    setInputValue("");
    setIsBotTyping(true);
    scrollToBottom();

    const delay = 300 + Math.random() * 500;
    setTimeout(() => {
      const responseText = getBotResponse(trimmed);
      const botMsg: ChatMessage = {
        id: uid(),
        role: "bot",
        text: responseText,
        timestamp: new Date(),
      };
      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
      setIsBotTyping(false);
      scrollToBottom();
    }, delay);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  function clearHistory() {
    setMessages([]);
    localStorage.removeItem(STORAGE_HISTORY_KEY);
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3"
      style={{ fontFamily: "inherit" }}
    >
      {/* ── Expanded Chat Panel ── */}
      {isOpen && (
        <div
          data-ocid="chat.dialog"
          className="flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: "380px",
            height: "500px",
            background: "linear-gradient(160deg, #12102a 0%, #1a1232 100%)",
            border: "1px solid rgba(139,92,246,0.3)",
            boxShadow:
              "0 0 40px rgba(139,92,246,0.2), 0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{
              background: "rgba(0,0,0,0.3)",
              borderBottom: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{
                  background: "linear-gradient(135deg, #ff4fd8, #8b5cf6)",
                }}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Prydo Support
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Always here for you 🏳️‍🌈
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && !showOnboarding && (
                <button
                  type="button"
                  data-ocid="chat.clear_button"
                  onClick={clearHistory}
                  className="text-[10px] px-2 py-0.5 rounded-md transition-all hover:opacity-80"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                data-ocid="chat.close_button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:opacity-70"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L11 11M11 1L1 11"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body — onboarding OR chat */}
          {showOnboarding ? (
            <OnboardingSlide onDone={handleOnboardingDone} />
          ) : (
            <>
              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-4 py-3"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(139,92,246,0.3) transparent",
                }}
              >
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}

                {/* Typing indicator */}
                {isBotTyping && (
                  <div className="flex justify-start mb-3">
                    <div
                      className="px-4 py-3 rounded-2xl rounded-tl-sm"
                      style={{
                        background: "rgba(20,10,40,0.7)",
                        border: "1px solid rgba(139,92,246,0.25)",
                        borderLeft: "3px solid #8b5cf6",
                      }}
                    >
                      <div
                        className="flex gap-1.5 items-center"
                        aria-label="Bot is typing"
                      >
                        {(["dot-a", "dot-b", "dot-c"] as const).map(
                          (key, dotIdx) => (
                            <span
                              key={key}
                              className="block w-2 h-2 rounded-full"
                              style={{
                                background: "#8b5cf6",
                                animation: "bounce 1.2s infinite",
                                animationDelay: `${dotIdx * 0.2}s`,
                              }}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestion chips */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      data-ocid="chat.suggestion_chip"
                      onClick={() => sendMessage(chip)}
                      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                      style={{
                        background: "rgba(139,92,246,0.15)",
                        border: "1px solid rgba(139,92,246,0.3)",
                        color: "#c084fc",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div
                className="px-3 pb-3 pt-2 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="flex gap-2 items-center rounded-xl px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(139,92,246,0.25)",
                  }}
                >
                  <input
                    ref={inputRef}
                    data-ocid="chat.input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything... / Kuch bhi poochein..."
                    disabled={isBotTyping}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                    aria-label="Chat message input"
                  />
                  <button
                    type="button"
                    data-ocid="chat.send_button"
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim() || isBotTyping}
                    aria-label="Send message"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                    style={{
                      background:
                        inputValue.trim() && !isBotTyping
                          ? "linear-gradient(135deg, #ff4fd8 0%, #8b5cf6 100%)"
                          : "rgba(255,255,255,0.08)",
                      opacity: inputValue.trim() && !isBotTyping ? 1 : 0.4,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Toggle FAB button ── */}
      <button
        type="button"
        data-ocid="chat.toggle_button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close chat support" : "Open chat support"}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 btn-gradient animate-pulse-glow"
        style={{
          boxShadow:
            "0 0 24px rgba(255,79,216,0.4), 0 0 48px rgba(139,92,246,0.2)",
        }}
      >
        {isOpen ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
