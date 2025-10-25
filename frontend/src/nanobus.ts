import Nanobus from "nanobus";
import type { Completer } from "./lib/completer";

type Events = {
  crop: (image_url: string, completer: Completer<{ data_url: string; width: number; height: number }>) => void;
  //wallet_approval: (show: boolean) => void;
  pixel_manager: (completer: Completer<number[]>) => void;
  awaiter: (
    config: Partial<{
      shown: boolean;
      title: string;
      message: string;
      icon: string;
    }>,
  ) => void;
};

export const bus = new Nanobus<Events>();
