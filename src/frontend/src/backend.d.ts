import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface FraudFlag {
    status: string;
    refereeWallet: string;
    flagReason: string;
    timestamp: bigint;
    severity: string;
    referrerWallet: string;
}
export interface Account {
    owner: Principal;
    subaccount?: Uint8Array;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface DataCertificate {
    certificate: Uint8Array;
    hash_tree: Uint8Array;
}
export interface PrydoIdWithTokenId {
    tokenId?: bigint;
    photo?: ExternalBlob;
    idRecord: PrydoIdRecord;
}
export interface PrydoIdWithPhoto {
    photo?: ExternalBlob;
    idRecord: PrydoIdRecord;
}
export type TransferResult = {
    __kind__: "Ok";
    Ok: bigint;
} | {
    __kind__: "Err";
    Err: TransferError;
};
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ArchivedBlocksRange {
    start: bigint;
    length: bigint;
}
export interface VerificationRecord {
    status: VerificationStatus;
    liveness_retry_count?: bigint;
    liveness_attempts?: Array<LivenessAttempt>;
    id_document_type?: IdDocumentType;
    error_reason?: string;
    liveness_cooldown_until?: bigint;
    verified_at: bigint;
    wallet: string;
}
export type Value = {
    __kind__: "Int";
    Int: bigint;
} | {
    __kind__: "Map";
    Map: Array<[string, Value]>;
} | {
    __kind__: "Nat";
    Nat: bigint;
} | {
    __kind__: "Blob";
    Blob: Uint8Array;
} | {
    __kind__: "Bool";
    Bool: boolean;
} | {
    __kind__: "Text";
    Text: string;
} | {
    __kind__: "Array";
    Array: Array<Value>;
};
export interface MintOutput {
    idCount: bigint;
    record: PrydoIdWithPhoto;
}
export interface MintInfo {
    tokenId: bigint;
    mintTimestamp: bigint;
    blockIndex: bigint;
    wallet: string;
}
export interface LivenessStatus {
    cooldown_until?: bigint;
    retry_count: bigint;
    attempts: Array<LivenessAttempt>;
}
export interface LivenessAttempt {
    attempted_at: bigint;
    passed: boolean;
    challenge_type: ChallengeType;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type VerificationResult = {
    __kind__: "ok";
    ok: VerificationRecord;
} | {
    __kind__: "err";
    err: string;
};
export interface TransferArg {
    to: Account;
    token_id: bigint;
    memo?: Uint8Array;
    from_subaccount?: Uint8Array;
    created_at_time?: bigint;
}
export interface ReferralRecord {
    referrer: string;
    blockId: bigint;
    timestamp: bigint;
    ipHash: string;
    deviceHash: string;
    referee: string;
}
export interface PrydoIdRecord {
    avatarType: string;
    tier: string;
    timestamp: bigint;
    wallet: string;
}
export type TransferError = {
    __kind__: "GenericError";
    GenericError: {
        message: string;
        error_code: bigint;
    };
} | {
    __kind__: "Duplicate";
    Duplicate: {
        duplicate_of: bigint;
    };
} | {
    __kind__: "NonExistingTokenId";
    NonExistingTokenId: null;
} | {
    __kind__: "Unauthorized";
    Unauthorized: null;
} | {
    __kind__: "CreatedInFuture";
    CreatedInFuture: {
        ledger_time: bigint;
    };
} | {
    __kind__: "InvalidRecipient";
    InvalidRecipient: null;
} | {
    __kind__: "GenericBatchError";
    GenericBatchError: {
        message: string;
        error_code: bigint;
    };
} | {
    __kind__: "TooOld";
    TooOld: null;
};
export enum ChallengeType {
    smile = "smile",
    blink = "blink"
}
export enum IdDocumentType {
    Passport = "Passport",
    Aadhaar = "Aadhaar",
    DriversLicense = "DriversLicense",
    NationalId = "NationalId"
}
export enum VerificationStatus {
    FAIL = "FAIL",
    PASS = "PASS",
    UNVERIFIED = "UNVERIFIED",
    PENDING = "PENDING"
}
export interface backendInterface {
    addReferral(referrer: string, referee: string, ipHash: string, deviceHash: string): Promise<void>;
    clearAllIds(): Promise<bigint>;
    generateReferralCode(wallet: string): Promise<string>;
    getAllMintedIds(): Promise<Array<PrydoIdWithPhoto>>;
    getAllMintedIdsWithTokenIds(): Promise<Array<PrydoIdWithTokenId>>;
    getFraudFlags(): Promise<Array<FraudFlag>>;
    getIdByWallet(wallet: string): Promise<PrydoIdWithPhoto>;
    getIdCount(): Promise<bigint>;
    getLivenessStatus(wallet: string): Promise<LivenessStatus>;
    /**
     * / Look up a wallet's mint info: tokenId, ICRC-3 blockIndex, mintTimestamp.
     * / Returns null if the wallet has never minted a Prydo ID.
     */
    getMintInfoByWallet(wallet: string): Promise<MintInfo | null>;
    /**
     * / Returns total minted supply (tokenCounter). Alias for icrc7_total_supply.
     */
    getMintedCount(): Promise<bigint>;
    getReferralsByWallet(wallet: string): Promise<Array<ReferralRecord>>;
    getVerificationStatus(wallet: string): Promise<VerificationRecord>;
    icrc3_get_blocks(args: Array<{
        start: bigint;
        length: bigint;
    }>): Promise<{
        log_length: bigint;
        blocks: Array<{
            id: bigint;
            block: Value;
        }>;
        archived_blocks: Array<ArchivedBlocksRange>;
    }>;
    icrc3_get_tip_certificate(): Promise<DataCertificate | null>;
    icrc3_supported_block_types(): Promise<Array<{
        url: string;
        block_type: string;
    }>>;
    icrc7_atomic_batch_transfers(): Promise<boolean | null>;
    icrc7_balance_of(accounts: Array<Account>): Promise<Array<bigint>>;
    icrc7_collection_metadata(): Promise<Array<[string, Value]>>;
    icrc7_default_take_value(): Promise<bigint | null>;
    icrc7_description(): Promise<string | null>;
    icrc7_logo(): Promise<string | null>;
    icrc7_max_memo_size(): Promise<bigint | null>;
    icrc7_max_query_batch_size(): Promise<bigint | null>;
    icrc7_max_take_value(): Promise<bigint | null>;
    icrc7_max_update_batch_size(): Promise<bigint | null>;
    icrc7_name(): Promise<string>;
    icrc7_owner_of(token_ids: Array<bigint>): Promise<Array<Account | null>>;
    icrc7_supply_cap(): Promise<bigint | null>;
    icrc7_symbol(): Promise<string>;
    icrc7_token_metadata(token_ids: Array<bigint>): Promise<Array<Array<[string, Value]> | null>>;
    icrc7_tokens(prev: bigint | null, take: bigint | null): Promise<Array<bigint>>;
    icrc7_tokens_of(account: Account, prev: bigint | null, take: bigint | null): Promise<Array<bigint>>;
    icrc7_total_supply(): Promise<bigint>;
    /**
     * / Minimal transfer stub — transfers are not intended in Prydo but required for ICRC-7 compliance.
     */
    icrc7_transfer(args: Array<TransferArg>): Promise<Array<TransferResult | null>>;
    /**
     * / Mint a Prydo ID. Requires a PASS verification for the wallet.
     */
    mintId(wallet: string, tier: string, avatarType: string, photo: ExternalBlob | null): Promise<MintOutput>;
    reVerifyIdentity(wallet: string): Promise<string>;
    removeId(wallet: string): Promise<boolean>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateFlagStatus(referrerWallet: string, refereeWallet: string, timestamp: bigint, newStatus: string): Promise<boolean>;
    uploadPhoto(wallet: string, photo: ExternalBlob): Promise<PrydoIdWithPhoto>;
    verifyIdentity(wallet: string, id_image_url: string, selfie_image_url: string, idDocumentType: IdDocumentType, liveness_results: Array<[string, boolean]>): Promise<VerificationResult>;
}
