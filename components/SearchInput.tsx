import React from "react";
import { Input } from "./ui/input";

export default function SearchInput() {
  const [userOpen, setUserOpen] = React.useState(false);

  return (
    <div className="relative">
      {userOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setUserOpen(false)}
        />
      )}
      {/* todo: form */}
    </div>
  );
}
