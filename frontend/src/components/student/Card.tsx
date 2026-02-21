import React from "react";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={["p-4", props.className ?? ""].join(" ")} />
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={["p-4 pt-0", props.className ?? ""].join(" ")} />
  );
}