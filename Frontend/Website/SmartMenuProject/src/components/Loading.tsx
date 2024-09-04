import React from "react";
import { bouncy } from "ldrs";

bouncy.register();

const Loading: React.FC = () => {
  return <l-bouncy size="45" speed="1.75" color="#5D5FEF"></l-bouncy>;
};

export default Loading;
