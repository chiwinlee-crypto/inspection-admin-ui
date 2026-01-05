import { Card, CardContent, CardHeader, CardTitle } from "./Card";

export function MapPlaceholder({ lat, lng }: { lat?: number; lng?: number }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>地图定位（示意）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 h-[420px] grid place-items-center">
          <div className="text-center">
            <div className="text-sm font-semibold text-slate-900">腾讯地图占位</div>
            <div className="text-xs text-slate-500 mt-1">lat: {lat?.toFixed(5)} / lng: {lng?.toFixed(5)}</div>
            <div className="mt-4 inline-flex items-center rounded-full bg-blue-600 text-white px-4 py-2 text-xs shadow-soft">
              📍 已标注
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
