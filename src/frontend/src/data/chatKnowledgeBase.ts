// Prydo AI Chatbot Knowledge Base
// Rule-based FAQ system — NO external API calls
// Bilingual: English + Hindi (auto-detected via Devanagari script)

interface KnowledgeEntry {
  patterns: RegExp[];
  responseEn: string;
  responseHi: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // GROUP 1 — How to Mint
  {
    patterns: [
      /\bmint\b/i,
      /\bnft\b/i,
      /\bid\s*banao\b/i,
      /\bid\s*kaise\b/i,
      /\bprydo\s*id\b/i,
      /आईडी\s*कैसे/i,
      /\bमिंट\b/i,
      /\bid\s*banayen\b/i,
      /\bhow\s*to\s*create\b/i,
      /\bget\s*id\b/i,
    ],
    responseEn: `🪙 **How to Mint Your Prydo ID:**

1. **Connect Wallet** — Click "Connect Wallet" in the top navbar
2. **Complete KYC** — Upload your Passport or National ID, take a selfie, and pass the liveness challenge (blink/smile)
3. **Choose Your Tier** — Select Genesis, Standard, or Basic
4. **Confirm Mint** — Review and confirm on-chain minting

Your Prydo ID is a **soulbound NFT** — it cannot be transferred or sold. One wallet = one ID.

Need help with a specific step? Just ask! 🏳️‍🌈`,
    responseHi: `🪙 **Prydo ID Mint Kaise Karein:**

1. **Wallet Connect Karein** — Navbar mein "Connect Wallet" par click karein
2. **KYC Complete Karein** — Passport ya National ID upload karein, selfie lein, aur liveness challenge (blink/smile) pass karein
3. **Tier Chunein** — Genesis, Standard, ya Basic mein se ek select karein
4. **Mint Confirm Karein** — On-chain minting review karke confirm karein

Aapka Prydo ID ek **soulbound NFT** hai — ise transfer ya sell nahi kiya ja sakta. Ek wallet = ek ID.

Kisi specific step mein madad chahiye? Bas poochein! 🏳️‍🌈`,
  },

  // GROUP 2 — Identity Verification / KYC
  {
    patterns: [
      /\bverif/i,
      /\bkyc\b/i,
      /\bdocument\b/i,
      /\bselfie\b/i,
      /\bcamera\b/i,
      /\bliveness\b/i,
      /\bpassport\b/i,
      /\bnational\s*id\b/i,
      /\bid\s*proof\b/i,
      /\bsatyapan\b/i,
      /\bsarkar.*id\b/i,
      /सत्यापन/i,
      /\bdocument\s*upload\b/i,
      /\bverification\s*fail\b/i,
    ],
    responseEn: `🔍 **Identity Verification (KYC) Guide:**

Prydo uses AI-based identity verification to ensure real, unique users:

**Step 1 — Upload Government ID**
• Accepted: Passport or National ID
• Make sure the document is clear, well-lit, not expired

**Step 2 — Take a Selfie**
• Look directly into the camera
• Ensure good lighting on your face

**Step 3 — Liveness Challenge**
• You'll be asked to **blink** or **smile**
• This proves you're a real person (not a photo)

Once all steps pass ✅, your "Mint" button will unlock.

**Note:** Re-verification is available from your Profile panel anytime.`,
    responseHi: `🔍 **Identity Verification (KYC) Guide:**

Prydo AI-based verification use karta hai taaki sirf real aur unique users hon:

**Step 1 — Government ID Upload Karein**
• Accepted: Passport ya National ID
• Document clear, achhi roshni mein, aur expired nahi hona chahiye

**Step 2 — Selfie Lein**
• Camera ki taraf seedha dekhein
• Chehra acche prakash mein hona chahiye

**Step 3 — Liveness Challenge**
• Aapse **blink** ya **smile** karne ko kaha jayega
• Isse prove hota hai ki aap real person hain (photo nahi)

Jab sab steps pass ho jayein ✅, tab "Mint" button unlock ho jayega.

**Note:** Profile panel se kabhi bhi re-verification kar sakte hain.`,
  },

  // GROUP 3 — Wallet Connect
  {
    patterns: [
      /\bwallet\b/i,
      /\bconnect\b/i,
      /\blogin\b/i,
      /\binternet\s*identity\b/i,
      /\bmetamask\b/i,
      /\bwalletconnect\b/i,
      /\btrust\s*wallet\b/i,
      /\bicp\s*wallet\b/i,
      /\bwallet\s*kaise\b/i,
      /\bwallet\s*connect\b/i,
      /वॉलेट/i,
      /\bsign\s*in\b/i,
    ],
    responseEn: `🔗 **How to Connect Your Wallet:**

**Option 1 — Internet Identity (ICP)**
• Click "Connect Wallet" in the navbar
• Choose "Internet Identity"
• Sign in with your ICP anchor

**Option 2 — EVM Wallets (MetaMask / Trust Wallet)**
• Choose MetaMask or Trust Wallet from the wallet modal
• Approve the connection in your wallet app

**Option 3 — WalletConnect (300+ wallets)**
• Click "WalletConnect" in the wallet modal
• Scan the QR code with your mobile wallet

Once connected, the app automatically checks if you already have a minted Prydo ID. 🏳️‍🌈`,
    responseHi: `🔗 **Wallet Connect Kaise Karein:**

**Option 1 — Internet Identity (ICP)**
• Navbar mein "Connect Wallet" par click karein
• "Internet Identity" choose karein
• Apne ICP anchor se sign in karein

**Option 2 — EVM Wallets (MetaMask / Trust Wallet)**
• Wallet modal mein MetaMask ya Trust Wallet choose karein
• Apne wallet app mein connection approve karein

**Option 3 — WalletConnect (300+ wallets)**
• Wallet modal mein "WalletConnect" click karein
• Mobile wallet se QR code scan karein

Connect hone par app automatically check karta hai ki aapka Prydo ID already mint hua hai ya nahi. 🏳️‍🌈`,
  },

  // GROUP 4 — Tiers
  {
    patterns: [
      /\bgenesis\b/i,
      /\bstandard\b/i,
      /\bbasic\b/i,
      /\btier\b/i,
      /\bgold\b/i,
      /\bsilver\b/i,
      /\bbronze\b/i,
      /\bdifference\b/i,
      /\bfark\b/i,
      /\bkaunsa\s*tier\b/i,
      /\bwhich\s*tier\b/i,
      /टियर/i,
    ],
    responseEn: `✨ **Prydo ID Tiers Explained:**

🥇 **Genesis ID (Gold)**
• Limited edition — first-ever Prydo members
• Exclusive Genesis badge on your NFT card
• Highest rarity & community status
• Priority access to future features

🥈 **Standard ID (Silver)**
• Full community access
• Verification badge
• Access to all platform features
• Great for early adopters

🥉 **Basic ID (Bronze)**
• Entry-level Prydo membership
• Core platform features
• Perfect for getting started

All tiers are **soulbound** — non-transferable, non-saleable. Your identity, forever. 🏳️‍🌈`,
    responseHi: `✨ **Prydo ID Tiers Explained:**

🥇 **Genesis ID (Gold)**
• Limited edition — Prydo ke pehle members
• NFT card par exclusive Genesis badge
• Sabse zyada rarity aur community status
• Future features ka priority access

🥈 **Standard ID (Silver)**
• Full community access
• Verification badge
• Sab platform features ka access
• Early adopters ke liye perfect

🥉 **Basic ID (Bronze)**
• Entry-level Prydo membership
• Core platform features
• Shuru karne ke liye sahi choice

Sabhi tiers **soulbound** hain — non-transferable, non-saleable. Aapki identity, hamesha ke liye. 🏳️‍🌈`,
  },

  // GROUP 5 — LGBTQ Legal Rights
  {
    patterns: [
      /\bsection\s*377\b/i,
      /\blegal\b/i,
      /\brights\b/i,
      /\blaw\b/i,
      /\blgbtq\s*rights\b/i,
      /\bqueer\s*rights\b/i,
      /\bsame.sex\s*marriage\b/i,
      /\bmarriage\s*equality\b/i,
      /\bdiscrimination\b/i,
      /\bprotection\b/i,
      /\bkanoon\b/i,
      /\badhikar\b/i,
      /अधिकार/i,
      /कानून/i,
    ],
    responseEn: `⚖️ **LGBTQ+ Legal Rights:**

**India:**
• 🎉 In **September 2018**, India's Supreme Court struck down Section 377, decriminalizing consensual same-sex relations
• LGBTQ+ individuals are protected from arbitrary arrests under this ruling
• However, same-sex marriage is not yet legally recognized in India

**Globally:**
• 🌍 **30+ countries** have legalized same-sex marriage (including USA, UK, Canada, Australia, Germany, France)
• Many countries offer legal partnership rights and anti-discrimination protections
• The UN Human Rights Council recognizes LGBTQ+ rights as human rights

**Know Your Rights:**
You deserve dignity, respect, and protection under the law. If you face discrimination, document it and seek support from local LGBTQ+ organizations.

You are valid. You are protected. 🏳️‍🌈`,
    responseHi: `⚖️ **LGBTQ+ Kanuni Adhikar:**

**India:**
• 🎉 **September 2018** mein India ke Supreme Court ne Section 377 hataya, jisse consensual same-sex relations decriminalize ho gaye
• Is ruling ke baad LGBTQ+ logon ko arbitrary arrest se protection milti hai
• Lekin India mein same-sex marriage abhi legally recognized nahi hai

**Globally:**
• 🌍 **30+ deshon** mein same-sex marriage legal hai (USA, UK, Canada, Australia, Germany, France shaamil hain)
• Kai deshon mein legal partnership rights aur anti-discrimination protections hain
• UN Human Rights Council LGBTQ+ rights ko human rights maanta hai

**Apne Adhikar Jaanein:**
Aap kanoon ke tahat dignity, respect, aur protection ke haqdar hain. Agar aapko discrimination face ho, toh document karein aur local LGBTQ+ organizations se support lein.

Aap valid hain. Aap protected hain. 🏳️‍🌈`,
  },

  // GROUP 6 — Mental Health / Crisis Support
  {
    patterns: [
      /\bmental\s*health\b/i,
      /\bcrisis\b/i,
      /\bsuicid/i,
      /\bdepression\b/i,
      /\banxiety\b/i,
      /\bstruggling\b/i,
      /\bhurt\b/i,
      /\bpareshan\b/i,
      /\budaas\b/i,
      /\bmadad\s*chahiye\b/i,
      /\bnot\s*okay\b/i,
      /\bfeeling\s*(sad|low|bad|lost)\b/i,
      /\balone\b/i,
      /\bself.harm\b/i,
      /परेशान/i,
      /उदास/i,
      /मदद/i,
      /\bafraid\b/i,
      /\bscared\b/i,
    ],
    responseEn: `💜 **You're not alone. We're here for you.**

It takes courage to reach out, and we're proud of you for doing so.

**Crisis Helplines (Available 24/7):**

🇺🇸 **Trevor Project (LGBTQ+ Youth):**
📞 1-866-488-7386 | Text START to 678-678

🌍 **Trans Lifeline:**
📞 877-565-8860 (US) | 877-330-6366 (Canada)

🇮🇳 **iCall India:**
📞 9152987821

🌐 **Crisis Text Line (Global):**
Text HOME to 741741

**Remember:**
• Your feelings are valid
• The Prydo community stands with you
• Seeking help is a sign of strength, not weakness
• You deserve joy, love, and safety 🏳️‍🌈

If you're in immediate danger, please call your local emergency services (100 in India, 911 in USA).`,
    responseHi: `💜 **Aap akele nahi hain. Hum aapke saath hain.**

Madad maangna bahut himmat ka kaam hai, aur hum aap par proud hain.

**Crisis Helplines (24/7 Available):**

🇺🇸 **Trevor Project (LGBTQ+ Youth):**
📞 1-866-488-7386 | START text karein 678-678 par

🌍 **Trans Lifeline:**
📞 877-565-8860 (US) | 877-330-6366 (Canada)

🇮🇳 **iCall India:**
📞 9152987821

🌐 **Crisis Text Line (Global):**
HOME text karein 741741 par

**Yaad Rakhein:**
• Aapki feelings valid hain
• Prydo community aapke saath khadi hai
• Madad maangna strength ki nishani hai, kamzori ki nahi
• Aap khushi, pyaar, aur suraksha ke layak hain 🏳️‍🌈

Agar aap turant khatre mein hain, toh apni local emergency services call karein (India mein 100, USA mein 911).`,
  },

  // GROUP 7 — About Prydo
  {
    patterns: [
      /\bprydo\s*kya\b/i,
      /\bwhat\s*is\s*prydo\b/i,
      /\babout\s*prydo\b/i,
      /\bplatform\s*kya\b/i,
      /\bprydo\s*ke\s*bare\b/i,
      /\bprydo\s*about\b/i,
      /\bprydo\s*explain\b/i,
      /\bprydo\s*details\b/i,
      /\bkya\s*hai\s*prydo\b/i,
      /प्राइडो/i,
    ],
    responseEn: `🏳️‍🌈 **About Prydo:**

Prydo is the world's first **LGBTQ+ Web3 Identity Platform** built on the **Internet Computer Protocol (ICP)** blockchain.

**What makes Prydo unique:**
• 🔐 **Soulbound NFT IDs** — Your identity is permanently yours, non-transferable
• ✅ **AI-Verified** — Government ID + liveness verification before minting
• 🌈 **Pride-First Community** — Built exclusively for the LGBTQ+ community
• ⛓️ **On-Chain Verification** — Your identity is secured on the ICP blockchain
• 🛡️ **1 Wallet, 1 ID** — Prevents duplicate and fake accounts

**Canister ID:** \`019d5706-b836-735e-800b-271d8d3c95d3\`
**Website:** prydo.xyz

Prydo is more than an NFT — it's your verified digital identity in the Web3 world. 🌈`,
    responseHi: `🏳️‍🌈 **Prydo Ke Baare Mein:**

Prydo duniya ka pehla **LGBTQ+ Web3 Identity Platform** hai jo **Internet Computer Protocol (ICP)** blockchain par bana hai.

**Prydo kya special banata hai:**
• 🔐 **Soulbound NFT IDs** — Aapki identity permanently aapki hai, transfer nahi hoti
• ✅ **AI-Verified** — Mint se pehle government ID + liveness verification
• 🌈 **Pride-First Community** — Exclusively LGBTQ+ community ke liye bana hai
• ⛓️ **On-Chain Verification** — Aapki identity ICP blockchain par secure hai
• 🛡️ **1 Wallet, 1 ID** — Duplicate aur fake accounts prevent karta hai

**Canister ID:** \`019d5706-b836-735e-800b-271d8d3c95d3\`
**Website:** prydo.xyz

Prydo sirf ek NFT nahi — Web3 duniya mein aapki verified digital identity hai. 🌈`,
  },

  // GROUP 8 — Referral
  {
    patterns: [
      /\breferral\b/i,
      /\brefer\b/i,
      /\binvite\b/i,
      /\bcode\b/i,
      /\bshare\b/i,
      /\breferral\s*code\b/i,
      /\bdost\s*ko\b/i,
      /\bfriend\s*ko\b/i,
      /रेफरल/i,
      /\bearning\b/i,
      /\bcommission\b/i,
    ],
    responseEn: `🔗 **Referral Program:**

Invite your friends to Prydo and grow the community!

**How it works:**
1. Connect your wallet and mint your Prydo ID
2. Go to your **Profile Panel** to find your unique referral code
3. Share the code or link with your friends
4. When they mint using your code, you earn rewards

**Important:**
• Each referral is tracked on-chain for transparency
• Anti-fraud detection is in place — suspicious referral patterns are flagged for admin review
• Commission is released only after verification

Share Prydo with the people you love! 🏳️‍🌈`,
    responseHi: `🔗 **Referral Program:**

Apne doston ko Prydo par invite karein aur community grow karein!

**Kaise kaam karta hai:**
1. Wallet connect karein aur Prydo ID mint karein
2. **Profile Panel** mein jaayein apna unique referral code dhoondhne ke liye
3. Code ya link apne doston ke saath share karein
4. Jab woh aapke code se mint karein, aapko rewards milenge

**Zaroori:**
• Har referral transparency ke liye on-chain track hota hai
• Anti-fraud detection active hai — suspicious referral patterns admin review ke liye flag hote hain
• Commission sirf verification ke baad release hoti hai

Apne pyaron ke saath Prydo share karein! 🏳️‍🌈`,
  },

  // GROUP 9 — Admin / Contact / Support / Bug
  {
    patterns: [
      /\badmin\b/i,
      /\bcontact\b/i,
      /\bsupport\b/i,
      /\bproblem\b/i,
      /\bissue\b/i,
      /\bbug\b/i,
      /\berror\b/i,
      /\bpareshani\b/i,
      /\bsamasya\b/i,
      /\bkaam\s*nahi\b/i,
      /\bnot\s*working\b/i,
      /\bglitch\b/i,
      /\bfix\b/i,
      /परेशानी/i,
      /समस्या/i,
    ],
    responseEn: `🛠️ **Need Help or Found a Bug?**

We're here to help! Here's how to get support:

**For Platform Issues:**
• Check your wallet connection first — disconnect and reconnect
• For KYC issues, ensure good lighting and a clear document photo
• Clear browser cache and try again

**For Account/NFT Issues:**
• Your minting transaction can be verified at:
  [ICP Dashboard](https://dashboard.internetcomputer.org/canister/019d5706-b836-735e-800b-271d8d3c95d3)

**Contact Caffeine Support:**
• Visit [caffeine.ai](https://caffeine.ai) for platform support
• The Prydo community is actively monitored

Please describe your issue in detail and our team will assist you as quickly as possible. 🏳️‍🌈`,
    responseHi: `🛠️ **Madad Chahiye ya Bug Mila?**

Hum madad ke liye hain! Support kaise lein:

**Platform Issues Ke Liye:**
• Pehle wallet connection check karein — disconnect karke reconnect karein
• KYC issues ke liye, achhi roshni aur clear document photo ensure karein
• Browser cache clear karke dobara try karein

**Account/NFT Issues Ke Liye:**
• Aapka minting transaction yahan verify kar sakte hain:
  [ICP Dashboard](https://dashboard.internetcomputer.org/canister/019d5706-b836-735e-800b-271d8d3c95d3)

**Caffeine Support Se Contact Karein:**
• Platform support ke liye [caffeine.ai](https://caffeine.ai) visit karein
• Prydo community actively monitored hai

Apni problem detail mein batayein aur hamari team jald se jald help karegi. 🏳️‍🌈`,
  },
];

const FALLBACK_EN = `🏳️‍🌈 **Hi! I'm Prydo Support Bot.**

I can help you with:
• 🪙 How to mint your Prydo ID
• 🔍 Identity verification (KYC)
• 🔗 Wallet connection
• ✨ Tier differences (Genesis / Standard / Basic)
• ⚖️ LGBTQ+ legal rights
• 💜 Mental health & crisis support
• 🏳️‍🌈 About Prydo platform
• 🔗 Referral program
• 🛠️ Technical support

What would you like to know? Just ask! 😊`;

const FALLBACK_HI = `🏳️‍🌈 **Namaste! Main Prydo Support Bot hoon.**

Main aapki in baaton mein madad kar sakta hoon:
• 🪙 Prydo ID kaise mint karein
• 🔍 Identity verification (KYC)
• 🔗 Wallet connection
• ✨ Tier differences (Genesis / Standard / Basic)
• ⚖️ LGBTQ+ kanuni adhikar
• 💜 Mental health aur crisis support
• 🏳️‍🌈 Prydo platform ke baare mein
• 🔗 Referral program
• 🛠️ Technical support

Aap kya jaanna chahte hain? Bas poochein! 😊`;

/** Detect if input contains Devanagari script */
function isHindi(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/** Main FAQ response function — rule-based, no external API */
export function getBotResponse(input: string): string {
  const trimmed = input.trim();
  const hindi = isHindi(trimmed);

  for (const entry of KNOWLEDGE_BASE) {
    if (entry.patterns.some((pattern) => pattern.test(trimmed))) {
      return hindi ? entry.responseHi : entry.responseEn;
    }
  }

  return hindi ? FALLBACK_HI : FALLBACK_EN;
}

export type { KnowledgeEntry };
