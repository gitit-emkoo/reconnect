// declare module "*.svg" {
//   import React = require("react");
//   const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
//   export default ReactComponent;
// }

// src/types/svg.d.ts 
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string; // 이 줄이 없어도 동작할 수 있지만, 일반적으로 포함합니다.
  export default src; // 이 줄이 없어도 동작할 수 있지만, 일반적으로 포함합니다.
}