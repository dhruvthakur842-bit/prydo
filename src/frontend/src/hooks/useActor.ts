import { useActor as useActorBase } from "@caffeineai/core-infrastructure";
import type { backendInterface } from "../backend";
import { createActor } from "../backend";

// Wrap createActor to match createActorFunction<backendInterface>
export function useActor() {
  const { actor, isFetching } = useActorBase<backendInterface>(createActor);
  return { actor, isFetching };
}
