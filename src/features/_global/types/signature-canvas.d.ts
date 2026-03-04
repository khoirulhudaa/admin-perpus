declare module "react-signature-canvas" {
  import { Component, Ref } from "react";

  export interface SignatureCanvasProps {
    ref?: Ref<any>;
    penColor?: string;
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    getCanvas() {
      throw new Error("Method not implemented.");
    }
    getCanvas: any;
    clear(): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromDataURL(dataURL: string, options?: object): void;
  }
}
