import React from "react";

export interface LoginProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface StopWatchProps {
  isStopWatchRunning: boolean;
}
