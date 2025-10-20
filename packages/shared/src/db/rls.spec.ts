import { describe, expect, it } from "vitest";
import type { Analysis, AnalysisResult, Kit, Notification, Video } from "./types";

type UserId = string;

type Tables = {
  videos: Video[];
  analysis: Analysis[];
  analysis_result: AnalysisResult[];
  kits: Kit[];
  notifications: Notification[];
};

const tables: Tables = {
  videos: [
    { id: "video-a", user_id: "user-a", r2_key: "a", url: "https://a", duration_s: 10, has_audio: true, created_at: new Date().toISOString() },
    { id: "video-b", user_id: "user-b", r2_key: "b", url: "https://b", duration_s: 12, has_audio: true, created_at: new Date().toISOString() },
  ],
  analysis: [
    { id: "analysis-a", video_id: "video-a", status: "completed", started_at: new Date().toISOString(), finished_at: new Date().toISOString(), error_code: null, parent_analysis_id: null },
    { id: "analysis-b", video_id: "video-b", status: "completed", started_at: new Date().toISOString(), finished_at: new Date().toISOString(), error_code: null, parent_analysis_id: null },
  ],
  analysis_result: [
    { id: "result-a", analysis_id: "analysis-a", radar: {}, scores: {}, warnings: [], recommendations: [] },
    { id: "result-b", analysis_id: "analysis-b", radar: {}, scores: {}, warnings: [], recommendations: [] },
  ],
  kits: [
    { id: "kit-a", analysis_id: "analysis-a", version: 1, title: "Kit A", caption: "Cap A", hashtags: [], music_keywords: [], best_time: null, created_at: new Date().toISOString() },
    { id: "kit-b", analysis_id: "analysis-b", version: 1, title: "Kit B", caption: "Cap B", hashtags: [], music_keywords: [], best_time: null, created_at: new Date().toISOString() },
  ],
  notifications: [
    { id: "notif-a", user_id: "user-a", type: "analysis_done", payload: {}, read_at: null, created_at: new Date().toISOString() },
    { id: "notif-b", user_id: "user-b", type: "analysis_done", payload: {}, read_at: null, created_at: new Date().toISOString() },
  ],
};

function ownsVideo(videoId: string, userId: UserId) {
  return tables.videos.some((video) => video.id === videoId && video.user_id === userId);
}

function canRead(table: keyof Tables, row: Tables[typeof table][number], userId: UserId): boolean {
  switch (table) {
    case "videos":
      return (row as Video).user_id === userId;
    case "analysis":
      return ownsVideo((row as Analysis).video_id, userId);
    case "analysis_result": {
      const analysis = tables.analysis.find((a) => a.id === (row as AnalysisResult).analysis_id);
      return analysis ? ownsVideo(analysis.video_id, userId) : false;
    }
    case "kits": {
      const analysis = tables.analysis.find((a) => a.id === (row as Kit).analysis_id);
      return analysis ? ownsVideo(analysis.video_id, userId) : false;
    }
    case "notifications":
      return (row as Notification).user_id === userId;
    default:
      return false;
  }
}

function selectRows<T extends keyof Tables>(table: T, userId: UserId): Tables[T] {
  return tables[table].filter((row) => canRead(table, row, userId)) as Tables[T];
}

describe("RLS simulation", () => {
  it("isolates analysis artefacts per user", () => {
    const userAResults = selectRows("analysis_result", "user-a");
    const userBResults = selectRows("analysis_result", "user-b");

    expect(userAResults).toHaveLength(1);
    expect(userAResults[0]?.analysis_id).toBe("analysis-a");
    expect(userBResults).toHaveLength(1);
    expect(userBResults[0]?.analysis_id).toBe("analysis-b");
  });

  it("keeps kits and notifications scoped to owner", () => {
    expect(selectRows("kits", "user-a").map((k) => k.id)).toEqual(["kit-a"]);
    expect(selectRows("kits", "user-b").map((k) => k.id)).toEqual(["kit-b"]);
    expect(selectRows("notifications", "user-a").map((n) => n.id)).toEqual(["notif-a"]);
    expect(selectRows("notifications", "user-b").map((n) => n.id)).toEqual(["notif-b"]);
  });

  it("denies cross-tenant access", () => {
    expect(selectRows("analysis_result", "user-a").some((row) => row.analysis_id === "analysis-b")).toBe(false);
    expect(selectRows("analysis", "user-b").some((row) => row.video_id === "video-a")).toBe(false);
  });
});
