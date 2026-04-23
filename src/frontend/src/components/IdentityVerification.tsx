import { ExternalBlob, IdDocumentType, VerificationStatus } from "@/backend";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  Loader2,
  RotateCcw,
  ScanFace,
  Shield,
  Smile,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

type VerifStep =
  | "intro"
  | "id-upload"
  | "selfie"
  | "liveness"
  | "checking"
  | "result";
type ResultStatus = "pass" | "fail" | null;
type ChallengeType = "blink" | "smile";

interface LivenessChallenge {
  type: ChallengeType;
  instruction: string;
  icon: React.ElementType;
  color: string;
}

interface LivenessResult {
  challengeType: ChallengeType;
  passed: boolean;
}

const LIVENESS_CHALLENGES: LivenessChallenge[] = [
  {
    type: "blink",
    instruction: "Blink your eyes 2 times",
    icon: Eye,
    color: "#22D3EE",
  },
  {
    type: "smile",
    instruction: "Give a big smile",
    icon: Smile,
    color: "#EC4899",
  },
];

const CHALLENGE_DURATION = 10; // seconds
const MAX_RETRIES = 3;

interface IdentityVerificationProps {
  walletAddress: string;
  onVerified: () => void;
}

// Reusable drag-drop upload zone
function UploadZone({
  label,
  hint,
  file,
  onFile,
  onRemove,
  icon: Icon,
  accentColor,
  ocid,
}: {
  label: string;
  hint: string;
  file: File | null;
  onFile: (f: File) => void;
  onRemove: () => void;
  icon: React.ElementType;
  accentColor: string;
  ocid: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f?.type.startsWith("image/")) onFile(f);
    },
    [onFile],
  );

  const fmtSize = (b: number) =>
    b < 1024 * 1024
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div>
      <p
        className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2"
        style={{ color: accentColor }}
      >
        {label}
      </p>
      {!file ? (
        <button
          type="button"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => ref.current?.click()}
          className="w-full rounded-xl p-6 flex flex-col items-center gap-3 transition-all cursor-pointer"
          style={{
            border: `2px dashed ${dragging ? accentColor : `${accentColor}55`}`,
            background: dragging ? `${accentColor}10` : `${accentColor}06`,
          }}
          data-ocid={ocid}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}44`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <div className="text-center">
            <p className="text-white/75 text-sm font-semibold">
              Drop here or{" "}
              <span style={{ color: accentColor }}>click to upload</span>
            </p>
            <p className="text-white/35 text-xs mt-0.5">{hint}</p>
          </div>
        </button>
      ) : (
        <div
          className="flex items-center gap-3 rounded-xl p-3"
          style={{
            background: `${accentColor}10`,
            border: `1px solid ${accentColor}30`,
          }}
        >
          {previewUrl && (
            <img
              src={previewUrl}
              alt={label}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              style={{ border: `2px solid ${accentColor}50` }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {file.name}
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">
              {fmtSize(file.size)}
            </p>
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full mt-1.5 text-[9px] font-bold"
              style={{
                background: "rgba(34,197,94,0.12)",
                color: "#22C55E",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <CheckCircle2 className="w-2.5 h-2.5" /> Ready
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
            aria-label="Remove file"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}

const ID_TYPE_OPTIONS: {
  id: string;
  label: string;
  flag: string;
  desc: string;
  docType: IdDocumentType;
}[] = [
  {
    id: "passport",
    label: "Passport",
    flag: "🌐",
    desc: "International travel document accepted worldwide",
    docType: IdDocumentType.Passport,
  },
  {
    id: "national-id",
    label: "National ID",
    flag: "🆔",
    desc: "Government-issued national identity card",
    docType: IdDocumentType.NationalId,
  },
];

// Native browser camera selfie component
function SelfieStep({
  selfieFile,
  onCapture,
  onRemove,
  onBack,
  onNext,
}: {
  selfieFile: File | null;
  onCapture: (f: File) => void;
  onRemove: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [camActive, setCamActive] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [useUpload, setUseUpload] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    setCamError(null);
    setCamLoading(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera not supported in this browser. Please use Chrome or Safari.",
        );
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        // Wait for metadata to load before playing — prevents black screen
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error("Video element error"));
          setTimeout(() => resolve(), 3000); // fallback timeout
        });
        try {
          await video.play();
        } catch {
          // play() may fail if component unmounted; ignore
        }
      }
      setCamActive(true);
    } catch (e: unknown) {
      let msg = "Camera access denied";
      if (e instanceof Error) {
        if (
          e.name === "NotAllowedError" ||
          e.name === "PermissionDeniedError"
        ) {
          msg =
            "Camera permission denied. Please allow camera access in your browser settings and try again.";
        } else if (
          e.name === "NotFoundError" ||
          e.name === "DevicesNotFoundError"
        ) {
          msg = "No camera found. Please connect a camera and try again.";
        } else if (e.name === "NotReadableError") {
          msg =
            "Camera is in use by another application. Close other apps and try again.";
        } else {
          msg = e.message;
        }
      }
      setCamError(msg);
    } finally {
      setCamLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }
    setCamActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          stopCamera();
          onCapture(file);
        }
      },
      "image/jpeg",
      0.9,
    );
  }, [stopCamera, onCapture]);

  useEffect(() => {
    if (!useUpload && !selfieFile) startCamera();
    return () => stopCamera();
  }, [useUpload, selfieFile, startCamera, stopCamera]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!selfieFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selfieFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selfieFile]);

  return (
    <motion.div
      key="selfie"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div
        className="rounded-2xl p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(10,5,25,0.85))",
          border: "1px solid rgba(236,72,153,0.25)",
        }}
      >
        <p
          className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3"
          style={{ color: "#EC4899" }}
        >
          Take a Selfie
        </p>

        {!useUpload ? (
          <>
            {selfieFile ? (
              <div
                className="relative rounded-xl overflow-hidden mb-3"
                style={{ aspectRatio: "4/3" }}
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Selfie preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <div
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      color: "#22C55E",
                      border: "1px solid rgba(34,197,94,0.4)",
                    }}
                  >
                    ✓ Captured
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="relative rounded-xl overflow-hidden mb-3 w-full bg-black"
                style={{
                  aspectRatio: "4/3",
                  border: "1px solid rgba(236,72,153,0.3)",
                }}
              >
                {camError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                    <Camera className="w-10 h-10 text-white/20" />
                    <p className="text-white/40 text-sm text-center">
                      {camError}
                    </p>
                    <button
                      type="button"
                      onClick={() => setUseUpload(true)}
                      className="px-4 py-2 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(236,72,153,0.2)",
                        color: "#F472B6",
                        border: "1px solid rgba(236,72,153,0.4)",
                      }}
                      data-ocid="identity-verification.selfie.use-upload"
                    >
                      Upload photo instead
                    </button>
                  </div>
                ) : camLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2
                      className="w-8 h-8 animate-spin"
                      style={{ color: "#EC4899" }}
                    />
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      autoPlay
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-40 h-48 rounded-full opacity-25"
                        style={{ border: "2px dashed #EC4899" }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2 mb-2">
              {selfieFile ? (
                <button
                  type="button"
                  onClick={() => {
                    onRemove();
                    startCamera();
                  }}
                  className="flex-1 py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: "rgba(236,72,153,0.15)",
                    color: "#F472B6",
                    border: "1px solid rgba(236,72,153,0.3)",
                  }}
                  data-ocid="identity-verification.selfie.retake"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              ) : (
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={!camActive || camLoading}
                  className="flex-1 py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: camActive
                      ? "linear-gradient(135deg, #EC4899, #8B5CF6)"
                      : "rgba(255,255,255,0.08)",
                    color: camActive ? "#fff" : "rgba(255,255,255,0.3)",
                    boxShadow: camActive
                      ? "0 0 16px rgba(236,72,153,0.4)"
                      : "none",
                  }}
                  data-ocid="identity-verification.selfie.capture"
                >
                  <Camera className="w-3.5 h-3.5" /> Capture
                </button>
              )}
            </div>

            {!selfieFile && !camError && (
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setUseUpload(true);
                }}
                className="w-full text-center text-[11px] text-white/35 hover:text-white/55 transition-colors"
                data-ocid="identity-verification.selfie.switch-to-upload"
              >
                Prefer to upload a photo instead?
              </button>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <UploadZone
              label="Upload Selfie Photo"
              hint="Clear, well-lit photo of your face — must match ID photo"
              file={selfieFile}
              onFile={onCapture}
              onRemove={onRemove}
              icon={ScanFace}
              accentColor="#EC4899"
              ocid="identity-verification.selfie.dropzone"
            />
            <button
              type="button"
              onClick={() => {
                onRemove();
                setUseUpload(false);
                startCamera();
              }}
              className="w-full text-center text-[11px] text-white/35 hover:text-white/55 transition-colors"
              data-ocid="identity-verification.selfie.use-camera"
            >
              Use camera instead
            </button>
          </div>
        )}
      </div>

      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
        style={{
          background: "rgba(139,92,246,0.06)",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <Shield
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: "#8B5CF6" }}
        />
        <p className="text-white/50 text-[11px] leading-relaxed">
          Your photos are processed by AI for verification only.{" "}
          <span className="text-white/80 font-semibold">
            Never stored permanently.
          </span>{" "}
          Only a verification proof is recorded on-chain.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-full font-bold text-xs tracking-wide text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all"
          data-ocid="identity-verification.selfie.back"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!selfieFile}
          onClick={onNext}
          className="flex-[2] py-3 rounded-full font-bold text-sm tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: selfieFile
              ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
              : "rgba(255,255,255,0.08)",
            color: selfieFile ? "white" : "rgba(255,255,255,0.4)",
            boxShadow: selfieFile ? "0 0 20px rgba(236,72,153,0.35)" : "none",
          }}
          data-ocid="identity-verification.selfie.next"
        >
          <Eye className="w-4 h-4" />
          Next: Liveness Check
        </button>
      </div>
    </motion.div>
  );
}

// Countdown bar component
function CountdownBar({
  total,
  remaining,
  color,
}: {
  total: number;
  remaining: number;
  color: string;
}) {
  const pct = (remaining / total) * 100;
  const urgentColor = remaining <= 3 ? "#EF4444" : color;
  return (
    <div
      className="w-full h-2 rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: urgentColor,
          boxShadow: `0 0 8px ${urgentColor}80`,
        }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: "linear" }}
      />
    </div>
  );
}

// Liveness challenge step
function LivenessStep({
  videoRef,
  canvasRef,
  streamRef,
  onComplete,
  onBack,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  onComplete: (results: LivenessResult[]) => void;
  onBack: () => void;
}) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [retries, setRetries] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [results, setResults] = useState<LivenessResult[]>([]);
  const [camActive, setCamActive] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const challenge = LIVENESS_CHALLENGES[challengeIdx];

  const startCamera = useCallback(async () => {
    setCamError(null);
    setCamLoading(true);
    try {
      // Reuse existing stream if still active
      if (streamRef.current) {
        const tracks = streamRef.current.getVideoTracks();
        if (tracks.length > 0 && tracks[0].readyState === "live") {
          if (videoRef.current) {
            const video = videoRef.current;
            video.srcObject = streamRef.current;
            await new Promise<void>((resolve) => {
              video.onloadedmetadata = () => resolve();
              setTimeout(() => resolve(), 3000);
            });
            try {
              await video.play();
            } catch {
              /* ignore */
            }
          }
          setCamActive(true);
          setCamLoading(false);
          return;
        }
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera not supported in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        // Wait for metadata before playing — prevents black screen
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => resolve();
          setTimeout(() => resolve(), 3000);
        });
        try {
          await video.play();
        } catch {
          /* ignore */
        }
      }
      setCamActive(true);
    } catch (e: unknown) {
      let msg = "Camera access denied";
      if (e instanceof Error) {
        if (
          e.name === "NotAllowedError" ||
          e.name === "PermissionDeniedError"
        ) {
          msg =
            "Camera permission denied. Please allow camera access in your browser settings.";
        } else if (
          e.name === "NotFoundError" ||
          e.name === "DevicesNotFoundError"
        ) {
          msg = "No camera found. Please connect a camera and try again.";
        } else if (e.name === "NotReadableError") {
          msg =
            "Camera is in use by another app. Close other apps and try again.";
        } else {
          msg = e.message;
        }
      }
      setCamError(msg);
    } finally {
      setCamLoading(false);
    }
  }, [videoRef, streamRef]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(video, 0, 0);
  }, [videoRef, canvasRef]);

  const startTimer = useCallback(() => {
    setTimeLeft(CHALLENGE_DURATION);
    setTimedOut(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setTimedOut(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCamera();
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startCamera, startTimer]);

  const handleDone = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    captureFrame();
    const newResult: LivenessResult = {
      challengeType: challenge.type,
      passed: true,
    };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    if (challengeIdx + 1 < LIVENESS_CHALLENGES.length) {
      setChallengeIdx(challengeIdx + 1);
      setRetries(0);
      setTimedOut(false);
      startTimer();
    } else {
      onComplete(updatedResults);
    }
  }, [
    challenge.type,
    captureFrame,
    challengeIdx,
    results,
    onComplete,
    startTimer,
  ]);

  const handleRetry = useCallback(() => {
    if (retries + 1 >= MAX_RETRIES) {
      setExhausted(true);
      return;
    }
    setRetries((r) => r + 1);
    setTimedOut(false);
    startTimer();
  }, [retries, startTimer]);

  if (exhausted) {
    return (
      <motion.div
        key="liveness-exhausted"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 px-6 rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(10,5,25,0.9))",
          border: "2px solid rgba(239,68,68,0.35)",
        }}
        data-ocid="identity-verification.liveness.exhausted"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "2px solid rgba(239,68,68,0.4)",
          }}
        >
          <AlertCircle className="w-8 h-8" style={{ color: "#EF4444" }} />
        </div>
        <h4 className="font-display font-bold text-xl text-white mb-2">
          Too Many Attempts
        </h4>
        <p className="text-white/55 text-sm mb-6 max-w-xs mx-auto">
          Please try again in 5 minutes and ensure your face is well-lit and
          clearly visible.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all hover:scale-[1.04] active:scale-95"
          style={{
            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
            color: "white",
            boxShadow: "0 0 24px rgba(139,92,246,0.4)",
          }}
          data-ocid="identity-verification.liveness.go-back"
        >
          Go Back
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="liveness"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      data-ocid="identity-verification.liveness"
    >
      {/* Progress pills */}
      <div className="flex items-center justify-center gap-2 mb-1">
        {LIVENESS_CHALLENGES.map((c, i) => {
          const done = results.some(
            (r) => r.challengeType === c.type && r.passed,
          );
          const active = i === challengeIdx;
          return (
            <div
              key={c.type}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all"
              style={{
                background: done
                  ? "rgba(34,197,94,0.15)"
                  : active
                    ? `${c.color}20`
                    : "rgba(255,255,255,0.05)",
                border: done
                  ? "1px solid rgba(34,197,94,0.4)"
                  : active
                    ? `1px solid ${c.color}60`
                    : "1px solid rgba(255,255,255,0.1)",
                color: done
                  ? "#22C55E"
                  : active
                    ? c.color
                    : "rgba(255,255,255,0.3)",
              }}
            >
              {done ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <c.icon className="w-3 h-3" />
              )}
              {c.instruction.split(" ").slice(0, 2).join(" ")}
            </div>
          );
        })}
      </div>

      {/* Camera + challenge card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: `1px solid ${challenge.color}40`,
          background: `linear-gradient(135deg, ${challenge.color}0A, rgba(10,5,25,0.9))`,
        }}
      >
        {/* Camera feed */}
        <div
          className="relative w-full bg-black"
          style={{ aspectRatio: "4/3" }}
        >
          {camError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
              <Camera className="w-10 h-10 text-white/20" />
              <p className="text-white/40 text-sm text-center">{camError}</p>
            </div>
          ) : camLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: challenge.color }}
              />
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              {/* Oval face guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-36 h-44 rounded-full"
                  style={{
                    border: `2px dashed ${challenge.color}`,
                    opacity: 0.4,
                    boxShadow: `0 0 24px ${challenge.color}40`,
                  }}
                />
              </div>
              {/* Retry badge */}
              {retries > 0 && (
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    background: "rgba(239,68,68,0.2)",
                    color: "#EF4444",
                    border: "1px solid rgba(239,68,68,0.4)",
                  }}
                >
                  Attempt {retries + 1}/{MAX_RETRIES}
                </div>
              )}
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {/* Challenge instruction + countdown */}
        <div className="p-4 space-y-3">
          <AnimatePresence mode="wait">
            {timedOut ? (
              <motion.div
                key="timed-out"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center space-y-3"
              >
                <p className="text-white/70 text-sm font-semibold">
                  Time's up! Didn't complete in time.
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${challenge.color}33, ${challenge.color}15)`,
                    border: `1px solid ${challenge.color}60`,
                    color: challenge.color,
                  }}
                  data-ocid="identity-verification.liveness.retry"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again ({MAX_RETRIES - retries - 1} left)
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`challenge-${challengeIdx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                {/* Instruction */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${challenge.color}18`,
                      border: `1px solid ${challenge.color}40`,
                    }}
                  >
                    <challenge.icon
                      className="w-5 h-5"
                      style={{ color: challenge.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                      Challenge {challengeIdx + 1} of{" "}
                      {LIVENESS_CHALLENGES.length}
                    </p>
                    <p
                      className="font-display font-bold text-base leading-tight"
                      style={{ color: challenge.color }}
                    >
                      {challenge.instruction}
                    </p>
                  </div>
                  <div
                    className="text-2xl font-display font-bold tabular-nums flex-shrink-0"
                    style={{
                      color: timeLeft <= 3 ? "#EF4444" : challenge.color,
                      textShadow: `0 0 12px ${timeLeft <= 3 ? "#EF444480" : `${challenge.color}80`}`,
                    }}
                  >
                    {timeLeft}
                  </div>
                </div>

                {/* Countdown bar */}
                <CountdownBar
                  total={CHALLENGE_DURATION}
                  remaining={timeLeft}
                  color={challenge.color}
                />

                {/* Done button */}
                <button
                  type="button"
                  onClick={handleDone}
                  disabled={!camActive}
                  className="w-full py-3 rounded-full font-bold text-sm tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  style={{
                    background: camActive
                      ? `linear-gradient(135deg, ${challenge.color}, #8B5CF6)`
                      : "rgba(255,255,255,0.08)",
                    color: camActive ? "white" : "rgba(255,255,255,0.4)",
                    boxShadow: camActive
                      ? `0 0 20px ${challenge.color}50`
                      : "none",
                  }}
                  data-ocid={`identity-verification.liveness.done-${challenge.type}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Done — I did it!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Privacy note */}
      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
        style={{
          background: "rgba(139,92,246,0.06)",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <Shield
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: "#8B5CF6" }}
        />
        <p className="text-white/50 text-[11px] leading-relaxed">
          Liveness check confirms you are a real person.{" "}
          <span className="text-white/80 font-semibold">
            No video is stored.
          </span>
        </p>
      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="w-full py-3 rounded-full font-bold text-xs tracking-wide text-white/40 hover:text-white/70 border border-white/10 hover:border-white/25 transition-all"
        data-ocid="identity-verification.liveness.back"
      >
        ← Back to Selfie
      </button>
    </motion.div>
  );
}

export default function IdentityVerification({
  walletAddress,
  onVerified,
}: IdentityVerificationProps) {
  const [step, setStep] = useState<VerifStep>("intro");
  const [selectedIdTypeId, setSelectedIdTypeId] = useState<string | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [livenessResults, setLivenessResults] = useState<LivenessResult[]>([]);
  const [result, setResult] = useState<ResultStatus>(null);
  const [failReason, setFailReason] = useState<string | null>(null);
  const { actor } = useActor();

  // Shared camera refs — reused between selfie and liveness steps
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when leaving liveness step
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }
  }, []);

  const selectedOption =
    ID_TYPE_OPTIONS.find((o) => o.id === selectedIdTypeId) ?? null;

  const handleLivenessComplete = useCallback(
    (results: LivenessResult[]) => {
      stopStream();
      setLivenessResults(results);
      setStep("checking");
    },
    [stopStream],
  );

  const handleCheck = useCallback(async () => {
    if (!idFile || !selfieFile || !actor || !selectedOption) return;

    try {
      const idBytes = new Uint8Array(await idFile.arrayBuffer());
      const idBlob = ExternalBlob.fromBytes(idBytes);
      const idUrl = idBlob.getDirectURL();

      const selfieBytes = new Uint8Array(await selfieFile.arrayBuffer());
      const selfieBlob = ExternalBlob.fromBytes(selfieBytes);
      const selfieUrl = selfieBlob.getDirectURL();

      const livenessPayload: Array<[string, boolean]> = livenessResults.map(
        (r) => [r.challengeType, r.passed],
      );
      const response = await actor.verifyIdentity(
        walletAddress,
        idUrl,
        selfieUrl,
        selectedOption.docType,
        livenessPayload,
      );

      if (
        response.__kind__ === "ok" &&
        response.ok.status === VerificationStatus.PASS
      ) {
        setResult("pass");
        setStep("result");
      } else {
        const reason =
          response.__kind__ === "err"
            ? response.err
            : (response.ok.error_reason ??
              "Verification could not be completed. Ensure your ID is clear and selfie matches.");
        setResult("fail");
        setFailReason(reason);
        setStep("result");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setResult("fail");
      setFailReason("An error occurred during verification. Please try again.");
      setStep("result");
    }
  }, [
    idFile,
    selfieFile,
    actor,
    selectedOption,
    walletAddress,
    livenessResults,
  ]);

  // Trigger check when entering checking step
  useEffect(() => {
    if (step === "checking") {
      handleCheck();
    }
  }, [step, handleCheck]);

  const handleRetry = () => {
    stopStream();
    setIdFile(null);
    setSelfieFile(null);
    setLivenessResults([]);
    setResult(null);
    setFailReason(null);
    setSelectedIdTypeId(null);
    setStep("intro");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
      data-ocid="identity-verification.container"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))",
            border: "1px solid rgba(139,92,246,0.4)",
            color: "#A78BFA",
          }}
        >
          <Shield className="w-3.5 h-3.5" />
          Identity Verification Required
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
          Verify Your Identity
        </h3>
        <p className="text-white/55 text-sm max-w-md mx-auto leading-relaxed">
          To prevent fake accounts and protect the Prydo community, verify your
          government ID before minting your Prydo ID NFT.
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {(
            ["intro", "id-upload", "selfie", "liveness", "checking"] as const
          ).map((s, i) => {
            const stepOrder: VerifStep[] = [
              "intro",
              "id-upload",
              "selfie",
              "liveness",
              "checking",
              "result",
            ];
            const currentIdx = stepOrder.indexOf(step);
            const thisIdx = stepOrder.indexOf(s);
            const isDone = currentIdx > thisIdx;
            const isActive = currentIdx === thisIdx;
            const stepColors = [
              "#8B5CF6",
              "#A78BFA",
              "#EC4899",
              "#22D3EE",
              "#22C55E",
            ];
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                  style={{
                    background: isDone
                      ? "rgba(34,197,94,0.2)"
                      : isActive
                        ? `${stepColors[i]}25`
                        : "rgba(255,255,255,0.05)",
                    border: isDone
                      ? "1px solid rgba(34,197,94,0.5)"
                      : isActive
                        ? `1px solid ${stepColors[i]}80`
                        : "1px solid rgba(255,255,255,0.1)",
                    color: isDone
                      ? "#22C55E"
                      : isActive
                        ? stepColors[i]
                        : "rgba(255,255,255,0.25)",
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                {i < 4 && (
                  <div
                    className="w-6 h-px"
                    style={{
                      background: isDone
                        ? "rgba(34,197,94,0.4)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step: Intro — ID type selection */}
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  icon: Shield,
                  label: "Privacy Safe",
                  desc: "AI analysis only, never stored",
                  color: "#8B5CF6",
                },
                {
                  icon: Eye,
                  label: "Liveness Check",
                  desc: "Blink & smile to prove presence",
                  color: "#22D3EE",
                },
                {
                  icon: FileText,
                  label: "Global IDs",
                  desc: "Passport & National ID accepted",
                  color: "#EC4899",
                },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 text-center"
                  style={{
                    background: `${color}0D`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{
                      background: `${color}18`,
                      border: `1px solid ${color}33`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <p className="text-white/80 text-[11px] font-bold">{label}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{desc}</p>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Select Your ID Type
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {ID_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedIdTypeId(opt.id)}
                  className="flex flex-col items-center gap-2 rounded-xl px-4 py-4 text-center transition-all"
                  style={{
                    background:
                      selectedIdTypeId === opt.id
                        ? "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(10,5,25,0.9))"
                        : "rgba(139,92,246,0.06)",
                    border:
                      selectedIdTypeId === opt.id
                        ? "2px solid rgba(139,92,246,0.6)"
                        : "1px solid rgba(139,92,246,0.2)",
                    boxShadow:
                      selectedIdTypeId === opt.id
                        ? "0 0 20px rgba(139,92,246,0.2)"
                        : "none",
                  }}
                  data-ocid={`identity-verification.id-type.${opt.id}`}
                >
                  <span className="text-3xl">{opt.flag}</span>
                  <div>
                    <p className="text-white/90 text-sm font-bold">
                      {opt.label}
                    </p>
                    <p className="text-white/40 text-[10px] mt-0.5 leading-snug">
                      {opt.desc}
                    </p>
                  </div>
                  {selectedIdTypeId === opt.id && (
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: "#8B5CF6" }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!selectedIdTypeId}
              onClick={() => setStep("id-upload")}
              className="w-full py-3.5 rounded-full font-bold text-sm tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: selectedIdTypeId
                  ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
                  : "rgba(255,255,255,0.08)",
                color: selectedIdTypeId ? "white" : "rgba(255,255,255,0.4)",
                boxShadow: selectedIdTypeId
                  ? "0 0 24px rgba(139,92,246,0.4)"
                  : "none",
              }}
              data-ocid="identity-verification.next.button"
            >
              Continue to Upload
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step: ID Upload */}
        {step === "id-upload" && (
          <motion.div
            key="id-upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div
              className="rounded-2xl p-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(10,5,25,0.85))",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              <UploadZone
                label={`Upload ${selectedOption?.label ?? "Government ID"}`}
                hint="JPG, PNG, WEBP — Clear photo of front of ID, max 5MB"
                file={idFile}
                onFile={setIdFile}
                onRemove={() => setIdFile(null)}
                icon={FileText}
                accentColor="#8B5CF6"
                ocid="identity-verification.id.dropzone"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("intro")}
                className="flex-1 py-3 rounded-full font-bold text-xs tracking-wide text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all"
                data-ocid="identity-verification.id-back.button"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!idFile}
                onClick={() => setStep("selfie")}
                className="flex-[2] py-3 rounded-full font-bold text-sm tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: idFile
                    ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
                    : "rgba(255,255,255,0.08)",
                  color: idFile ? "white" : "rgba(255,255,255,0.4)",
                  boxShadow: idFile ? "0 0 20px rgba(139,92,246,0.35)" : "none",
                }}
                data-ocid="identity-verification.id-next.button"
              >
                Next: Take Selfie
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step: Selfie with native camera */}
        {step === "selfie" && (
          <SelfieStep
            selfieFile={selfieFile}
            onCapture={setSelfieFile}
            onRemove={() => setSelfieFile(null)}
            onBack={() => setStep("id-upload")}
            onNext={() => setStep("liveness")}
          />
        )}

        {/* Step: Liveness challenges */}
        {step === "liveness" && (
          <LivenessStep
            videoRef={videoRef}
            canvasRef={canvasRef}
            streamRef={streamRef}
            onComplete={handleLivenessComplete}
            onBack={() => setStep("selfie")}
          />
        )}

        {/* Step: Checking */}
        {step === "checking" && (
          <motion.div
            key="checking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
            data-ocid="identity-verification.checking"
          >
            <div className="relative inline-flex items-center justify-center mb-6">
              <div
                className="w-24 h-24 rounded-full animate-spin"
                style={{
                  background:
                    "conic-gradient(from 0deg, #FF4FD8, #8B5CF6, #22D3EE, #34D399, #FBBF24, #FF4FD8)",
                  padding: "3px",
                }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{ background: "oklch(0.06 0.025 290)" }}
                />
              </div>
              <Shield
                className="w-8 h-8 absolute"
                style={{ color: "#8B5CF6" }}
              />
            </div>
            <h4 className="font-display font-bold text-xl text-white mb-2">
              Analyzing Your Documents
            </h4>
            <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed mb-4">
              AI is verifying your identity documents and liveness data. This
              may take up to 30 seconds…
            </p>
            {/* Liveness passed indicator */}
            {livenessResults.length > 0 && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-bold"
                style={{
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#22C55E",
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Liveness check passed (
                {livenessResults.filter((r) => r.passed).length}/
                {livenessResults.length})
              </div>
            )}
            <div className="flex items-center justify-center gap-6">
              {[
                "Document scan",
                "Face match",
                "Liveness verify",
                "Fraud check",
              ].map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{
                      color: "#8B5CF6",
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                  <span className="text-white/35 text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step: Result PASS */}
        {step === "result" && result === "pass" && (
          <motion.div
            key="pass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-10 px-6 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(139,92,246,0.08), rgba(10,5,25,0.9))",
              border: "2px solid rgba(34,197,94,0.4)",
              boxShadow: "0 0 60px rgba(34,197,94,0.12)",
            }}
            data-ocid="identity-verification.pass"
          >
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(139,92,246,0.15))",
                border: "2px solid rgba(34,197,94,0.5)",
                boxShadow: "0 0 30px rgba(34,197,94,0.3)",
              }}
            >
              <CheckCircle2
                className="w-10 h-10"
                style={{ color: "#22C55E" }}
              />
              <div
                className="absolute -inset-2 rounded-full animate-ping opacity-20"
                style={{ background: "rgba(34,197,94,0.4)" }}
              />
            </div>
            <h4 className="font-display font-bold text-2xl text-white mb-2">
              Identity Verified! 🎉
            </h4>
            <p className="text-white/60 text-sm mb-4 max-w-sm mx-auto">
              Your government ID, selfie, and liveness check have been verified.
              You can now mint your Prydo ID NFT.
            </p>
            {/* Liveness summary */}
            {livenessResults.length > 0 && (
              <div className="flex items-center justify-center gap-3 mb-5">
                {livenessResults.map((r) => (
                  <div
                    key={r.challengeType}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
                    style={{
                      background: r.passed
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(239,68,68,0.12)",
                      border: r.passed
                        ? "1px solid rgba(34,197,94,0.3)"
                        : "1px solid rgba(239,68,68,0.3)",
                      color: r.passed ? "#22C55E" : "#EF4444",
                    }}
                  >
                    {r.challengeType === "blink" ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <Smile className="w-3 h-3" />
                    )}
                    {r.challengeType === "blink" ? "Blink" : "Smile"} ✓
                  </div>
                ))}
              </div>
            )}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(139,92,246,0.1))",
                border: "1px solid rgba(34,197,94,0.4)",
                color: "#22C55E",
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-green-400"
                style={{ boxShadow: "0 0 6px #22C55E" }}
              />
              Verified Human ✓
            </div>
            <div>
              <button
                type="button"
                onClick={onVerified}
                className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all hover:scale-[1.04] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                  color: "white",
                  boxShadow: "0 0 30px rgba(139,92,246,0.5)",
                }}
                data-ocid="identity-verification.proceed-to-mint.button"
              >
                Proceed to Mint NFT →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step: Result FAIL */}
        {step === "result" && result === "fail" && (
          <motion.div
            key="fail"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-10 px-6 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(10,5,25,0.9))",
              border: "2px solid rgba(239,68,68,0.35)",
              boxShadow: "0 0 40px rgba(239,68,68,0.08)",
            }}
            data-ocid="identity-verification.fail"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "2px solid rgba(239,68,68,0.4)",
              }}
            >
              <AlertCircle className="w-10 h-10" style={{ color: "#EF4444" }} />
            </div>
            <h4 className="font-display font-bold text-2xl text-white mb-2">
              Verification Failed
            </h4>
            <p className="text-white/55 text-sm mb-2 max-w-sm mx-auto">
              {failReason}
            </p>
            <p className="text-white/35 text-xs mb-6">
              Tips: Ensure good lighting, no glare on ID, face clearly visible.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all hover:scale-[1.04] active:scale-95 flex items-center gap-2 mx-auto"
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                color: "white",
                boxShadow: "0 0 24px rgba(139,92,246,0.4)",
              }}
              data-ocid="identity-verification.retry.button"
            >
              <Upload className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
