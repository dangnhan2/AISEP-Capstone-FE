/**
 * Map message lỗi từ API mentorship (BE trả tiếng Anh) sang tiếng Việt cho toast/UI.
 */

export function translateMentorshipApiMessage(message?: string | null): string {
  if (!message || typeof message !== "string") return "Đã có lỗi xảy ra. Vui lòng thử lại.";
  const m = message.trim();
  const lower = m.toLowerCase();

  const exact: Record<string, string> = {
    "One or more proposed times overlap with the advisor's existing schedule.":
      "Một hoặc nhiều khung giờ đề xuất trùng với lịch hiện có của cố vấn. Vui lòng chọn thời gian khác.",
    "Proposed time slots must not overlap each other.":
      "Các khung giờ đề xuất không được chồng lên nhau. Vui lòng chỉnh lại.",
    "This time overlaps with another session already on your calendar.":
      "Khung giờ này trùng với một buổi tư vấn khác trên lịch của bạn. Vui lòng chọn thời gian khác.",
    "This time overlaps with another session already on the advisor's calendar.":
      "Khung giờ này trùng với lịch hiện có của cố vấn. Vui lòng chọn thời gian khác.",
    "Session has no scheduled start time.":
      "Buổi tư vấn chưa có giờ bắt đầu. Vui lòng làm mới trang và thử lại.",
  };

  if (exact[m]) return exact[m];

  if (lower.includes("one or more proposed times overlap"))
    return "Một hoặc nhiều khung giờ đề xuất trùng với lịch hiện có của cố vấn. Vui lòng chọn thời gian khác.";
  if (lower.includes("proposed time slots must not overlap"))
    return "Các khung giờ đề xuất không được chồng lên nhau. Vui lòng chỉnh lại.";
  if (lower.includes("another session already on your calendar"))
    return "Khung giờ này trùng với một buổi tư vấn khác trên lịch của bạn. Vui lòng chọn thời gian khác.";
  if (lower.includes("already on the advisor's calendar"))
    return "Khung giờ này trùng với lịch hiện có của cố vấn. Vui lòng chọn thời gian khác.";
  if (lower.includes("session has no scheduled start time"))
    return "Buổi tư vấn chưa có giờ bắt đầu. Vui lòng làm mới trang và thử lại.";

  return m;
}
