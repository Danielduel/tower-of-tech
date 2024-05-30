export const adminCommandRouting = {
  get: {
    subject: {
      "get_playlist_debug_data": "get_playlist_debug_data",
    } as const,
  },
  mark: {
    subject: {
      "mark_as_playlist_channel": "mark_as_playlist_channel",
    } as const,
  },
};
