"use client";

import { Card, CardContent } from "@/components/ui/Card";

export default function SettingPage() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold">设置</h1>
            <p className="text-muted-foreground text-center">正在开发中</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
