"use client";

const PLATFORM_ORDER = ["YouTube", "Facebook", "Instagram", "LinkedIn", "Twitter"];

const sortPosts = (arr = []) =>
  [...arr].sort((a, b) => {
    const da = new Date(a.created_at || a.posted_at || 0).getTime();
    const db = new Date(b.created_at || b.posted_at || 0).getTime();
    return db - da;
  });

const groupByPlatform = (posts = []) => {
  const grouped = PLATFORM_ORDER.reduce((acc, p) => ({ ...acc, [p]: [] }), {});
  for (const p of posts) {
    const key = PLATFORM_ORDER.includes(p.platform) ? p.platform : "Other";
    (grouped[key] || (grouped[key] = [])).push(p);
  }
  Object.keys(grouped).forEach((k) => (grouped[k] = sortPosts(grouped[k])));
  return grouped;
};

export default function Post({
  posts = [],
  loading,
  error,
  selectedId,
  onSelect,
  executiveName = "Muhammad Nauman",
}) {
  const grouped = groupByPlatform(posts);

  return (
    <div className="flex-1 h-auto md:h-[calc(100vh-100px)] w-full">
      {/* Centered title exactly like your style */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 my-4 md:my-6 font-cinzel">
        FROM THE DIARY OF {executiveName.toUpperCase()}
      </h2>

      <div className="max-h-[60vh] mt-4 md:max-h-[80vh] mx-auto overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-500">No posts yet.</div>
        ) : (
          <div className="space-y-10">
            {PLATFORM_ORDER.map((platform) =>
              (grouped[platform] || []).length ? (
                <section key={platform}>
                  {/* Platform title: centered, uppercase, Cinzel (to match SS) */}
                  <h2 className="heading_ed_book text-uppercase text-xl  font-times text-center mt-8">
                    {platform}
                  </h2>

                  {/* Numbered captions; underline on hover; bold when selected */}
                  <ol className="mt-6 list-questio pl-4 list-decimal space-y-1">
                    {grouped[platform].map((p) => (
                      <li key={p.id} className="leading-relaxed">
                        <button
                          type="button"
                          onClick={() => onSelect?.(p.id)}
                          className={`pointer cursor-pointer transition-colors hover:text-[#10b981] ${selectedId === p.id
                            }`}
                          title={p.caption || p.url}
                        >
                          {p.caption || p.url}
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
