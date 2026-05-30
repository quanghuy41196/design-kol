export type ProfileNiche = "beauty" | "tech" | "mom" | "lifestyle" | "food" | "fitness" | "business" | "other" | "fashion" | "travel" | "finance" | "education" | "gaming" | "pets";

export interface KOLProfile {
  id: string;
  name: string;
  niche: ProfileNiche;
  nicheLabel: string;
  avatarColor: string;
  initials: string;
  followers: string;
  quotaUsed: number;
  quotaTotal: number;
  status: "active" | "checkpoint" | "idle";
  linkedAccountId?: string;
  age?: string;
  gender?: string;
  occupation?: string;
  faceCount?: number;
}

export const PROFILES: KOLProfile[] = [
  {
    id: "p1",
    name: "Linh Nguyễn",
    niche: "beauty",
    nicheLabel: "Beauty",
    avatarColor: "#F5A623",
    initials: "LN",
    followers: "48.2K",
    quotaUsed: 142,
    quotaTotal: 200,
    status: "active",
  },
  {
    id: "p2",
    name: "Hùng MKT",
    niche: "tech",
    nicheLabel: "Tech",
    avatarColor: "#2C5AA0",
    initials: "HM",
    followers: "21.5K",
    quotaUsed: 88,
    quotaTotal: 200,
    status: "active",
  },
  {
    id: "p3",
    name: "Mai Chi",
    niche: "mom",
    nicheLabel: "Mom",
    avatarColor: "#3FB1B5",
    initials: "MC",
    followers: "12.8K",
    quotaUsed: 34,
    quotaTotal: 200,
    status: "idle",
  },
];

export type SourceLinkType = "website" | "facebook_profile" | "facebook_page" | "facebook_group";

export interface SourceLink {
  id: string;
  type: SourceLinkType;
  label: string;
  url: string;
  active: boolean;
}

export interface KOLBrand {
  profileId: string;
  tagline: string;
  bio: string;
  targetAudience: string;
  brandColors: string[];
  writingTones: string[];
  writingStyle: string;
  vocabularyUse: string[];
  vocabularyAvoid: string[];
  emojiUsage: "none" | "minimal" | "moderate" | "heavy";
  contentPillars: { name: string; description: string; pct: number }[];
  defaultHashtags: string[];
  ctaTemplates: string[];
  visualStyle: string;
  brandPersonality: string[];
  postingFrequency: string;
  bestPostingTimes: string[];
  sourceLinks: SourceLink[];
  fanAgeGroups?: string[];
  fanGender?: string;
  fanSpending?: string;
  fanInterests?: string[];
}

export const KOL_BRANDS: KOLBrand[] = [
  {
    profileId: "p1",
    tagline: "Đẹp tự nhiên, sống tích cực 🌸",
    bio: "Mình là Linh — beauty blogger 5 năm kinh nghiệm. Mình chia sẻ skincare thực tế, không quảng cáo lố. Mỗi sản phẩm mình đều dùng thật, cảm nhận thật.",
    targetAudience: "Nữ 18–34 tuổi, quan tâm skincare & makeup, thu nhập trung bình–khá, sống tại đô thị",
    brandColors: ["#F5A623", "#FDE68A", "#FFF7ED", "#1a1a1a"],
    writingTones: ["Thân thiện", "Gần gũi", "Chân thật", "Vui tươi"],
    writingStyle: "Viết như nói chuyện với bạn bè — dùng từ ngữ đời thường, xưng 'mình', gọi là 'bạn'. Câu ngắn, dễ đọc trên mobile. Hay dùng số liệu cụ thể (2 tuần, 3 lần/tuần).",
    vocabularyUse: ["mình", "bạn ơi", "thật sự", "cực kỳ", "đỉnh", "hợp lý", "xịn sò"],
    vocabularyAvoid: ["cam kết", "100%", "thần kỳ", "cải thiện hoàn toàn", "không tác dụng phụ"],
    emojiUsage: "moderate",
    contentPillars: [
      { name: "Review sản phẩm", description: "Đánh giá honest skincare, makeup", pct: 40 },
      { name: "Tips & Tutorial", description: "Hướng dẫn làm đẹp thực tế", pct: 30 },
      { name: "Lifestyle", description: "Cuộc sống, tích cực, self-care", pct: 20 },
      { name: "Q&A / Tương tác", description: "Trả lời câu hỏi followers", pct: 10 },
    ],
    defaultHashtags: ["#skincare", "#beauty", "#reviewmypham", "#linhnguyenbeauty", "#lamdepcunglinh", "#skincarevietnamese"],
    ctaTemplates: [
      "Bạn thử chưa? Comment cho mình biết nha! 💬",
      "Save bài này để dùng sau bạn nhé ✨",
      "Inbox mình để được tư vấn miễn phí 💕",
      "Tag bạn bè cùng xem nào 👇",
    ],
    visualStyle: "Tone màu ấm — cam mật ong, kem, trắng sữa. Ảnh sáng tự nhiên, background gọn gàng. Flat-lay hoặc close-up sản phẩm.",
    brandPersonality: ["Đáng tin cậy", "Gần gũi", "Chuyên nghiệp nhưng không khô khan", "Tích cực"],
    postingFrequency: "1–2 bài/ngày",
    bestPostingTimes: ["07:00–08:30", "12:00–13:00", "20:00–21:30"],
    sourceLinks: [
      { id: "sl1", type: "facebook_profile", label: "Profile FB cá nhân", url: "https://facebook.com/linhnguyenbeauty", active: true },
      { id: "sl2", type: "facebook_page",    label: "Fanpage Beauty",     url: "https://facebook.com/linhnguyenbeautypage", active: true },
      { id: "sl3", type: "website",          label: "Blog cá nhân",       url: "https://linhbeauty.vn", active: false },
    ],
  },
  {
    profileId: "p2",
    tagline: "Công nghệ đơn giản cho mọi người",
    bio: "Hùng MKT — review gadget, app, và công cụ năng suất. Mình dùng thật, nói thật. Không hype, không click-bait.",
    targetAudience: "Nam 22–40 tuổi, dân văn phòng, freelancer, startup. Thích năng suất và gadget mới.",
    brandColors: ["#2C5AA0", "#DBEAFE", "#F0F4FF", "#0f172a"],
    writingTones: ["Trực tiếp", "Khách quan", "Có chiều sâu", "Thực tế"],
    writingStyle: "Viết súc tích, có cấu trúc rõ ràng. Hay dùng list, bullet point, so sánh A/B. Đưa ra con số cụ thể. Kết luận rõ ràng: nên mua hay không.",
    vocabularyUse: ["thực tế", "đáng tiền", "không đáng tiền", "hiệu năng", "trải nghiệm", "đáng chú ý"],
    vocabularyAvoid: ["siêu phẩm", "xuất sắc", "không đối thủ", "bá đạo", "cực phẩm"],
    emojiUsage: "minimal",
    contentPillars: [
      { name: "Review thiết bị", description: "Đánh giá chi tiết gadget, máy tính, phone", pct: 45 },
      { name: "Năng suất & App", description: "Tool, app, workflow tăng productivity", pct: 30 },
      { name: "Tin tức công nghệ", description: "Update nhanh sản phẩm mới", pct: 15 },
      { name: "Hỏi đáp cộng đồng", description: "Tư vấn mua máy, setup", pct: 10 },
    ],
    defaultHashtags: ["#review", "#congnghe", "#gadget", "#hungmkttech", "#productivity", "#techvietnam"],
    ctaTemplates: [
      "Bạn đang dùng máy gì? Comment bên dưới 👇",
      "Save lại để xem khi cần mua nhé",
      "Có câu hỏi gì inbox mình thẳng",
      "Share cho ai đang phân vân 🔁",
    ],
    visualStyle: "Tone màu lạnh — xanh dương, trắng, xám. Ảnh sản phẩm trên background tối hoặc trắng. Infographic đơn giản. Screenshot thực tế.",
    brandPersonality: ["Khách quan", "Đáng tin", "Chuyên sâu", "Không thương mại hoá lộ liễu"],
    postingFrequency: "1 bài/ngày",
    bestPostingTimes: ["07:30–09:00", "12:00–13:30", "21:00–22:00"],
    sourceLinks: [
      { id: "sl4", type: "facebook_profile", label: "Profile FB Hùng MKT",    url: "https://facebook.com/hungmkttech", active: true },
      { id: "sl5", type: "website",          label: "Blog công nghệ",          url: "https://hungmkt.tech", active: true },
      { id: "sl6", type: "facebook_group",   label: "Nhóm Review Gadget VN",   url: "https://facebook.com/groups/reviewgadgetvn", active: false },
    ],
  },
  {
    profileId: "p3",
    tagline: "Hành trình làm mẹ — chân thật và ấm áp 🍼",
    bio: "Mình là Mai Chi, mẹ của bé Xu (3 tuổi). Chia sẻ kinh nghiệm nuôi con, dạy con và chăm sóc bản thân sau sinh. Mọi thứ mình viết đều từ trải nghiệm thật.",
    targetAudience: "Phụ nữ 25–38 tuổi, đã có con hoặc chuẩn bị sinh. Quan tâm nuôi dưỡng, giáo dục sớm, sức khoẻ mẹ & bé.",
    brandColors: ["#3FB1B5", "#CCFBF1", "#F0FDFA", "#1a2e2e"],
    writingTones: ["Ấm áp", "Chân thật", "Đồng cảm", "Khích lệ"],
    writingStyle: "Kể chuyện từ trải nghiệm cá nhân. Hay dùng 'hành trình', 'mình từng', 'bé nhà mình'. Câu chuyện có mở—thân—kết. Không phán xét cách nuôi con của người khác.",
    vocabularyUse: ["bé", "mẹ bỉm", "hành trình", "mình từng", "tụi mình", "thực sự", "may mắn"],
    vocabularyAvoid: ["phải", "đúng nhất", "sai rồi", "thất bại", "không tốt cho con"],
    emojiUsage: "moderate",
    contentPillars: [
      { name: "Nuôi con khoa học", description: "Ăn dặm, giấc ngủ, phát triển bé", pct: 35 },
      { name: "Câu chuyện mẹ bỉm", description: "Chia sẻ thật từ cuộc sống hàng ngày", pct: 30 },
      { name: "Mẹ chăm mẹ", description: "Sức khoẻ, tâm lý mẹ sau sinh", pct: 25 },
      { name: "Sản phẩm mẹ & bé", description: "Review đồ dùng thực tế", pct: 10 },
    ],
    defaultHashtags: ["#mebimsuavietnam", "#nuoicon", "#maichi", "#hainhtrinhlamme", "#bexu", "#momlife"],
    ctaTemplates: [
      "Mẹ nào đồng cảm với mình không? Share để nhiều mẹ biết nhé 💙",
      "Bé nhà bạn đang ở giai đoạn nào? Comment mình cùng thảo luận 👇",
      "Save lại cho khi bé đến tuổi này nha 📌",
      "Inbox mình nếu bạn cần thêm thông tin 🌿",
    ],
    visualStyle: "Tone màu xanh mint, kem, trắng. Ảnh mẹ và bé tự nhiên, không quá chỉnh sửa. Ánh sáng tự nhiên ban ngày. Không ảnh quá cầu kỳ.",
    brandPersonality: ["Ấm áp", "Chân thật", "Không phán xét", "Truyền cảm hứng nhẹ nhàng"],
    postingFrequency: "1 bài/ngày",
    bestPostingTimes: ["06:30–08:00", "13:00–14:00", "21:00–22:30"],
    sourceLinks: [
      { id: "sl7", type: "facebook_profile", label: "Profile FB Mai Chi",     url: "https://facebook.com/maichi.mom", active: true },
      { id: "sl8", type: "facebook_page",    label: "Fanpage Mẹ Bỉm Sữa",    url: "https://facebook.com/maichimomlife", active: true },
      { id: "sl9", type: "website",          label: "Blog nuôi con",          url: "https://maichimom.vn", active: false },
    ],
  },
];

export type PostStatus = "draft" | "scheduled" | "reminded" | "posted" | "archived";

export interface Post {
  id: string;
  title: string;
  content: string;
  aiScore: number; // 0-100, % unsafe
  status: PostStatus;
  format: "text" | "image" | "carousel" | "video";
  scheduledAt: string;
  profileId: string;
  charCount: number;
}

export const POSTS: Post[] = [
  {
    id: "ps1",
    title: "Review serum Vitamin C giảm thâm",
    content: "Ai bị thâm sạm sau Tết ơi! Mình thử em serum Vitamin C này 3 tuần, da sáng lên rõ. Texture mỏng nhẹ, không bết...",
    aiScore: 18,
    status: "scheduled",
    format: "carousel",
    scheduledAt: "2026-05-20T10:00:00",
    profileId: "p1",
    charCount: 480,
  },
  {
    id: "ps2",
    title: "Mẹo dưỡng tóc khô xơ tại nhà",
    content: "Tóc khô xơ là nỗi đau muôn thuở. Hôm nay mình share 5 mẹo cực rẻ mà hiệu quả nhé...",
    aiScore: 32,
    status: "draft",
    format: "text",
    scheduledAt: "2026-05-20T20:00:00",
    profileId: "p1",
    charCount: 320,
  },
  {
    id: "ps3",
    title: "Top 3 son lì lâu trôi tầm giá 200K",
    content: "Mua son không cần đắt — 3 em này mình test 8h vẫn còn màu, môi không khô...",
    aiScore: 24,
    status: "posted",
    format: "image",
    scheduledAt: "2026-05-19T19:00:00",
    profileId: "p1",
    charCount: 410,
  },
  {
    id: "ps4",
    title: "Đánh giá iPhone 17 Pro sau 1 tháng",
    content: "Sau 1 tháng dùng iPhone 17 Pro, đây là 5 điểm mình thích và 3 điểm chưa ổn...",
    aiScore: 15,
    status: "scheduled",
    format: "video",
    scheduledAt: "2026-05-21T19:00:00",
    profileId: "p2",
    charCount: 520,
  },
  {
    id: "ps5",
    title: "Setup bàn làm việc dưới 5 triệu",
    content: "Mình vừa setup lại bàn làm việc với ngân sách 5 củ. Cùng xem mình mua gì nhé...",
    aiScore: 28,
    status: "reminded",
    format: "carousel",
    scheduledAt: "2026-05-20T14:00:00",
    profileId: "p2",
    charCount: 380,
  },
  {
    id: "ps6",
    title: "Cho bé ăn dặm sai cách - 5 lỗi mẹ hay mắc",
    content: "Mình từng mắc 4/5 lỗi này. Đọc xong bài viết mới hiểu vì sao bé biếng ăn...",
    aiScore: 22,
    status: "scheduled",
    format: "text",
    scheduledAt: "2026-05-20T08:30:00",
    profileId: "p3",
    charCount: 290,
  },
  {
    id: "ps7",
    title: "Mua đồ sơ sinh: list cần & không cần",
    content: "Lần đầu làm mẹ mình mua rất nhiều thứ thừa. Giờ chia sẻ lại list thực tế...",
    aiScore: 19,
    status: "draft",
    format: "image",
    scheduledAt: "2026-05-22T10:00:00",
    profileId: "p3",
    charCount: 340,
  },
  {
    id: "ps8",
    title: "Mặt nạ dưỡng ẩm tự làm tại nhà",
    content: "Mặt nạ này mình làm từ mật ong + sữa chua. 2 tuần là thấy khác liền...",
    aiScore: 65,
    status: "draft",
    format: "carousel",
    scheduledAt: "2026-05-23T19:00:00",
    profileId: "p1",
    charCount: 280,
  },
  {
    id: "ps9",
    title: "Top app năng suất 2026",
    content: "5 app mình dùng hằng ngày giúp tăng productivity gấp 2 lần...",
    aiScore: 12,
    status: "posted",
    format: "text",
    scheduledAt: "2026-05-18T15:00:00",
    profileId: "p2",
    charCount: 360,
  },
  {
    id: "ps10",
    title: "Bí quyết chọn váy đi tiệc",
    content: "Mùa cưới đến rồi! Mình share cách chọn váy phù hợp dáng người...",
    aiScore: 45,
    status: "archived",
    format: "image",
    scheduledAt: "2026-05-15T18:00:00",
    profileId: "p1",
    charCount: 420,
  },
];

export interface Comment {
  id: string;
  postId: string;
  author: string;
  avatarColor: string;
  content: string;
  timestamp: string;
  likes: number;
  hasQuestion: boolean;
  status: "unanswered" | "answered" | "needs_review";
  profileId: string;
}

export const COMMENTS: Comment[] = [
  // p1 – Linh (Beauty)
  { id: "c1",  postId: "ps3", author: "Trần Hà My",      avatarColor: "#F5A623", content: "Chị ơi son số 2 mua ở đâu vậy ạ?",                       timestamp: "2026-05-20T08:30:00", likes: 12, hasQuestion: true,  status: "unanswered",  profileId: "p1" },
  { id: "c2",  postId: "ps3", author: "Nguyễn Linh",     avatarColor: "#3FB1B5", content: "Mình bị môi khô có dùng được không chị?",                  timestamp: "2026-05-20T08:15:00", likes: 8,  hasQuestion: true,  status: "unanswered",  profileId: "p1" },
  { id: "c3",  postId: "ps1", author: "Phan Thanh",      avatarColor: "#2C5AA0", content: "Serum này giá bao nhiêu vậy chị?",                         timestamp: "2026-05-20T09:00:00", likes: 5,  hasQuestion: true,  status: "unanswered",  profileId: "p1" },
  { id: "c4",  postId: "ps3", author: "Lê Vy",           avatarColor: "#E63946", content: "Em mua thử cây số 1 rồi, đỉnh thật chị!",                  timestamp: "2026-05-20T07:45:00", likes: 24, hasQuestion: false, status: "answered",    profileId: "p1" },
  { id: "c5",  postId: "ps1", author: "Đỗ Mai",          avatarColor: "#3FB1B5", content: "Da nhạy cảm dùng được không ạ?",                           timestamp: "2026-05-20T08:50:00", likes: 3,  hasQuestion: true,  status: "needs_review", profileId: "p1" },
  // p2 – Khoa (Tech)
  { id: "c6",  postId: "ps4", author: "Minh Tuấn",       avatarColor: "#7C3AED", content: "Camera iPhone 17 Pro có ngon hơn 16 không bạn?",           timestamp: "2026-05-20T10:10:00", likes: 14, hasQuestion: true,  status: "unanswered",  profileId: "p2" },
  { id: "c7",  postId: "ps4", author: "Hoàng Long",      avatarColor: "#059669", content: "Pin có cải thiện không? Mình đang dùng 15 cân nhắc lên đây", timestamp: "2026-05-20T09:45:00", likes: 21, hasQuestion: true,  status: "unanswered",  profileId: "p2" },
  { id: "c8",  postId: "ps5", author: "Gia Bảo",         avatarColor: "#F5A623", content: "Bàn đó mua ở đâu vậy bạn? Link đặt hàng không?",           timestamp: "2026-05-20T11:00:00", likes: 6,  hasQuestion: true,  status: "unanswered",  profileId: "p2" },
  { id: "c9",  postId: "ps9", author: "Thanh Phong",     avatarColor: "#E63946", content: "App Notion hay Obsidian hơn theo bạn?",                    timestamp: "2026-05-20T08:30:00", likes: 9,  hasQuestion: true,  status: "needs_review", profileId: "p2" },
  { id: "c16", postId: "ps5", author: "Công Danh",       avatarColor: "#2C5AA0", content: "Setup này cũng tương tự bên mình, 5 triệu là hơi căng 😅", timestamp: "2026-05-20T12:00:00", likes: 3,  hasQuestion: false, status: "answered",    profileId: "p2" },
  // p3 – Mai Mom (Parenting)
  { id: "c10", postId: "ps6", author: "Thanh Huyền",     avatarColor: "#F5A623", content: "Bé nhà mình 6 tháng, bắt đầu ăn dặm được chưa chị?",      timestamp: "2026-05-20T07:10:00", likes: 11, hasQuestion: true,  status: "unanswered",  profileId: "p3" },
  { id: "c11", postId: "ps6", author: "Kim Ngân",        avatarColor: "#2C5AA0", content: "Chị ơi bé ăn dặm kiểu BLW hay xay nhuyễn tốt hơn ạ?",     timestamp: "2026-05-20T07:30:00", likes: 7,  hasQuestion: true,  status: "unanswered",  profileId: "p3" },
  { id: "c12", postId: "ps7", author: "Diệu Linh",       avatarColor: "#E63946", content: "List của chị đúng quá! Mình mua máy hút sữa mà không xài", timestamp: "2026-05-20T08:55:00", likes: 15, hasQuestion: false, status: "answered",    profileId: "p3" },
  { id: "c13", postId: "ps7", author: "Spam Account 01", avatarColor: "#6B7280", content: "Đồ sơ sinh giá sỉ, inbox page nhé! Hàng chuẩn đảm bảo",   timestamp: "2026-05-20T05:00:00", likes: 0,  hasQuestion: false, status: "needs_review", profileId: "p3" },
  { id: "c14", postId: "ps6", author: "Phương Anh",      avatarColor: "#F5A623", content: "Cảm ơn chị, bài viết hữu ích quá 🥰",                      timestamp: "2026-05-20T09:20:00", likes: 8,  hasQuestion: false, status: "answered",    profileId: "p3" },
  { id: "c15", postId: "ps7", author: "Thu Hiền",        avatarColor: "#3FB1B5", content: "Địu em bé thương hiệu nào tốt không chị?",                 timestamp: "2026-05-20T06:40:00", likes: 4,  hasQuestion: true,  status: "unanswered",  profileId: "p3" },
];

export type MessageType = "mua_hang" | "thong_tin" | "phan_nan" | "spam";

export interface MessageThread {
  id: string;
  sender: string;
  avatarColor: string;
  preview: string;
  timestamp: string;
  type: MessageType;
  unread: boolean;
  botHandling: boolean;
  profileId: string;
  messages: { from: "them" | "me" | "bot"; text: string; time: string }[];
}

export const MESSAGE_THREADS: MessageThread[] = [
  {
    id: "m1", sender: "Nguyễn Thu Hà", avatarColor: "#F5A623",
    preview: "Chị ơi serum vitamin C còn không ạ?", timestamp: "2026-05-20T09:15:00",
    type: "mua_hang", unread: true, botHandling: false, profileId: "p1",
    messages: [
      { from: "them", text: "Chị ơi em muốn hỏi serum Vitamin C còn không ạ?", time: "09:12" },
      { from: "them", text: "Em có code giảm giá không vậy?", time: "09:15" },
    ]
  },
  {
    id: "m2", sender: "Lê Minh Anh", avatarColor: "#2C5AA0",
    preview: "Em đã nhận hàng rồi, đóng gói chắc lắm ạ", timestamp: "2026-05-20T08:45:00",
    type: "thong_tin", unread: false, botHandling: false, profileId: "p1",
    messages: [
      { from: "them", text: "Em đã nhận hàng rồi, đóng gói chắc lắm ạ", time: "08:45" },
      { from: "me", text: "Cảm ơn em! Em dùng thử nha, có gì feedback chị nha 💕", time: "08:50" },
    ]
  },
  {
    id: "m3", sender: "Phạm Hoài Linh", avatarColor: "#E63946",
    preview: "Chị ơi sản phẩm bị bể vỏ ạ, em chụp ảnh đây", timestamp: "2026-05-20T07:30:00",
    type: "phan_nan", unread: true, botHandling: false, profileId: "p1",
    messages: [
      { from: "them", text: "Chị ơi em vừa nhận hàng thì sản phẩm bị bể vỏ ạ 😢", time: "07:25" },
      { from: "them", text: "Em chụp ảnh đây ạ", time: "07:28" },
      { from: "them", text: "Chị xử lý giúp em với ạ", time: "07:30" },
    ]
  },
  {
    id: "m4", sender: "shop_giadinh_official", avatarColor: "#6B7280",
    preview: "Liên hệ shop sỉ giá rẻ, hàng chuẩn 100%, inbox ngay", timestamp: "2026-05-20T06:00:00",
    type: "spam", unread: true, botHandling: false, profileId: "p1",
    messages: [
      { from: "them", text: "Liên hệ shop sỉ giá rẻ, hàng chuẩn 100%, inbox ngay nhận giá tốt", time: "06:00" },
    ]
  },
  {
    id: "m5", sender: "Trần Diệu My", avatarColor: "#3FB1B5",
    preview: "Bot: Bảng giá đã được gửi cho khách hàng", timestamp: "2026-05-20T09:30:00",
    type: "mua_hang", unread: false, botHandling: true, profileId: "p1",
    messages: [
      { from: "them", text: "Cho mình hỏi giá serum bao nhiêu vậy?", time: "09:28" },
      { from: "bot", text: "Dạ chào chị! Serum Vitamin C 30ml giá 320K. Mua từ 2 hộp giảm 10% ạ. Em gửi link order: ...", time: "09:29" },
      { from: "them", text: "Ok mình order 2 nha", time: "09:30" },
    ]
  },
  {
    id: "m6", sender: "Vũ Hồng Nhung", avatarColor: "#F5A623",
    preview: "Em muốn hỏi về kem dưỡng ban đêm ạ", timestamp: "2026-05-20T08:20:00",
    type: "mua_hang", unread: true, botHandling: false, profileId: "p1",
    messages: [
      { from: "them", text: "Em muốn hỏi về kem dưỡng ban đêm ạ", time: "08:20" },
    ]
  },
  {
    id: "m7", sender: "Đinh Kim Ngân", avatarColor: "#2C5AA0",
    preview: "Bot: Hỏi thông tin sản phẩm chi tiết", timestamp: "2026-05-20T07:00:00",
    type: "thong_tin", unread: false, botHandling: true, profileId: "p1",
    messages: [
      { from: "them", text: "Sản phẩm này có tester không chị?", time: "06:58" },
      { from: "bot", text: "Dạ shop có gửi tester kèm đơn hàng từ 500K ạ. Chị tham khảo nhé!", time: "06:59" },
    ]
  },
  {
    id: "m8", sender: "Lý Bích Phương", avatarColor: "#E63946",
    preview: "Sao 2 ngày chưa thấy ship vậy shop?", timestamp: "2026-05-19T20:15:00",
    type: "phan_nan", unread: true, botHandling: false, profileId: "p1",
    messages: [
      { from: "them", text: "Sao 2 ngày chưa thấy ship vậy shop?", time: "20:15" },
    ]
  },
  {
    id: "m9", sender: "auto_promo_2026", avatarColor: "#6B7280",
    preview: "ĐĂNG KÝ NGAY: vay tiền không thế chấp...", timestamp: "2026-05-19T15:00:00",
    type: "spam", unread: true, botHandling: false, profileId: "p1",
    messages: [
      { from: "them", text: "ĐĂNG KÝ NGAY: vay tiền không thế chấp, duyệt nhanh 5 phút!", time: "15:00" },
    ]
  },
  {
    id: "m10", sender: "Bot - Bùi Thu Trang", avatarColor: "#3FB1B5",
    preview: "Bot: Đã thu thập SĐT và lưu CRM", timestamp: "2026-05-19T11:30:00",
    type: "mua_hang", unread: false, botHandling: true, profileId: "p1",
    messages: [
      { from: "them", text: "Mình muốn được tư vấn skincare ạ", time: "11:25" },
      { from: "bot", text: "Dạ vâng! Em xin SĐT để chị tư vấn gửi tài liệu cho ạ", time: "11:26" },
      { from: "them", text: "0901xxxxxx", time: "11:30" },
    ]
  },
];

export interface CrawledSource {
  id: string;
  sourceName: string;
  sourceAvatarColor: string;
  content: string;
  hasMedia: boolean;
  timestamp: string;
}

export const CRAWLED_SOURCES: CrawledSource[] = [
  { id: "cr1", sourceName: "Beauty Hacks VN", sourceAvatarColor: "#F5A623",
    content: "5 mẹo che thâm mụn cấp tốc cho buổi hẹn quan trọng — tip số 3 ai cũng quên...",
    hasMedia: true, timestamp: "2026-05-20T07:00:00" },
  { id: "cr2", sourceName: "Skincare Daily", sourceAvatarColor: "#3FB1B5",
    content: "Routine skincare 6 bước cho da dầu mụn mùa hè. Bước cleansing nên dùng gì?",
    hasMedia: false, timestamp: "2026-05-20T06:30:00" },
  { id: "cr3", sourceName: "Glam Asia", sourceAvatarColor: "#E63946",
    content: "Top 10 son lì 2026 — không trôi cả ngày, mềm môi không bết...",
    hasMedia: true, timestamp: "2026-05-19T22:15:00" },
  { id: "cr4", sourceName: "VN Beauty Trend", sourceAvatarColor: "#2C5AA0",
    content: "Xu hướng makeup hè 2026: tone cam đất lên ngôi, eyeliner mảnh comeback...",
    hasMedia: true, timestamp: "2026-05-19T18:00:00" },
  { id: "cr5", sourceName: "Beauty Insight", sourceAvatarColor: "#F5A623",
    content: "Sai lầm khi dùng retinol: 7 điều bạn cần biết trước khi bắt đầu...",
    hasMedia: false, timestamp: "2026-05-19T14:30:00" },
];

export interface BotScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  steps: { type: "trigger" | "action" | "next"; label: string; detail: string }[];
}

export const BOT_SCENARIOS: BotScenario[] = [
  {
    id: "bs1", name: "Keyword Trigger",
    description: "giá, mua, shop → gửi bảng giá + link",
    icon: "Bot", active: true,
    steps: [
      { type: "trigger", label: "Trigger", detail: "Tin nhắn chứa từ khoá: giá, mua, shop, order" },
      { type: "action", label: "Bot reply", detail: "Gửi bảng giá đầy đủ + link mua hàng có UTM" },
      { type: "next", label: "Tiếp theo", detail: "Đợi 2 phút → nếu chưa rep → gửi nudge nhẹ" },
    ],
  },
  {
    id: "bs2", name: "Welcome Message",
    description: "Tin nhắn đầu tiên từ người lạ",
    icon: "MessageSquare", active: true,
    steps: [
      { type: "trigger", label: "Trigger", detail: "Lần đầu nhắn tin từ user mới" },
      { type: "action", label: "Bot reply", detail: "Chào mừng + giới thiệu shop + menu nhanh 3 lựa chọn" },
    ],
  },
  {
    id: "bs3", name: "FAQ Flow",
    description: "Hỏi đáp theo cây quyết định",
    icon: "HelpCircle", active: true,
    steps: [
      { type: "trigger", label: "Trigger", detail: "User chọn menu 'Câu hỏi thường gặp'" },
      { type: "action", label: "Bot reply", detail: "Hiển thị 6 nhóm câu hỏi: ship, đổi trả, thanh toán..." },
      { type: "next", label: "Tiếp theo", detail: "Trả lời theo lựa chọn → đề xuất hỏi tiếp" },
    ],
  },
  {
    id: "bs4", name: "Affiliate Flow",
    description: "Hỏi sản phẩm → link đúng + UTM",
    icon: "ShoppingCart", active: true,
    steps: [
      { type: "trigger", label: "Trigger", detail: "Tin nhắn nêu tên sản phẩm hoặc category" },
      { type: "action", label: "Bot reply", detail: "Tìm link affiliate phù hợp + gắn UTM theo profile" },
      { type: "next", label: "Tiếp theo", detail: "Gửi 2-3 sản phẩm liên quan để upsell" },
    ],
  },
  {
    id: "bs5", name: "Lead Capture",
    description: "Thu SĐT, nhu cầu → lưu CRM",
    icon: "User", active: false,
    steps: [
      { type: "trigger", label: "Trigger", detail: "User muốn được tư vấn 1-1" },
      { type: "action", label: "Bot reply", detail: "Xin SĐT + nhu cầu cụ thể" },
      { type: "next", label: "Tiếp theo", detail: "Lưu vào CRM + tag theo niche → notify KOL" },
    ],
  },
  {
    id: "bs6", name: "Handoff",
    description: "Bot không chắc → chuyển người",
    icon: "ArrowRight", active: true,
    steps: [
      { type: "trigger", label: "Trigger", detail: "Confidence < 0.7 hoặc user nói 'gặp người'" },
      { type: "action", label: "Bot reply", detail: "Xin lỗi + báo sẽ có người liên hệ trong 15 phút" },
      { type: "next", label: "Tiếp theo", detail: "Notify KOL qua Telegram + đánh dấu thread urgent" },
    ],
  },
];

export interface ReplyTemplate {
  id: string;
  category: "thanks" | "product" | "inbox" | "spam";
  categoryLabel: string;
  title: string;
  text: string;
}

export const REPLY_TEMPLATES: ReplyTemplate[] = [
  { id: "rt1", category: "thanks", categoryLabel: "Cảm ơn", title: "Cảm ơn ủng hộ", text: "Cảm ơn bạn đã ủng hộ shop nha! Yêu bạn 💕" },
  { id: "rt2", category: "thanks", categoryLabel: "Cảm ơn", title: "Cảm ơn comment", text: "Cảm ơn bạn đã quan tâm bài viết của mình 🥰" },
  { id: "rt3", category: "thanks", categoryLabel: "Cảm ơn", title: "Cảm ơn feedback", text: "Cảm ơn feedback chân thực của bạn nhé! 🙌" },
  { id: "rt4", category: "thanks", categoryLabel: "Cảm ơn", title: "Cảm ơn theo dõi", text: "Cảm ơn bạn đã theo dõi mình lâu nay nha 💖" },
  { id: "rt5", category: "thanks", categoryLabel: "Cảm ơn", title: "Cảm ơn chia sẻ", text: "Cảm ơn bạn đã chia sẻ trải nghiệm của bạn nhé!" },

  { id: "rt6", category: "product", categoryLabel: "Thông tin sản phẩm", title: "Giá sản phẩm", text: "Giá em ấy là 320K bạn nha. Bạn cần info gì thêm cứ hỏi mình 😊" },
  { id: "rt7", category: "product", categoryLabel: "Thông tin sản phẩm", title: "Link mua hàng", text: "Bạn order qua link này nha: [link]. Có code SHIPFREE nữa ạ!" },
  { id: "rt8", category: "product", categoryLabel: "Thông tin sản phẩm", title: "Cách dùng", text: "Bạn dùng buổi tối, sau bước toner nha. 2-3 giọt thoa đều mặt là ok ạ!" },
  { id: "rt9", category: "product", categoryLabel: "Thông tin sản phẩm", title: "Thành phần", text: "Em ấy có Vitamin C 15% + Niacinamide + Hyaluronic Acid bạn nhé!" },
  { id: "rt10", category: "product", categoryLabel: "Thông tin sản phẩm", title: "Hạn dùng", text: "HSD 24 tháng kể từ ngày sản xuất, mở nắp dùng trong 6 tháng nha ạ." },

  { id: "rt11", category: "inbox", categoryLabel: "Hẹn inbox", title: "Hẹn inbox tư vấn", text: "Bạn inbox mình nha, mình tư vấn kỹ hơn vì comment khó nói chi tiết 🥰" },
  { id: "rt12", category: "inbox", categoryLabel: "Hẹn inbox", title: "Inbox xin code", text: "Bạn inbox mình lấy code giảm giá nha 🎁" },
  { id: "rt13", category: "inbox", categoryLabel: "Hẹn inbox", title: "Inbox xem thêm", text: "Còn nhiều mẫu lắm, bạn inbox mình gửi catalog full nha!" },
  { id: "rt14", category: "inbox", categoryLabel: "Hẹn inbox", title: "Inbox check size", text: "Bạn inbox cho mình chiều cao + cân nặng, mình check size giúp nha 😊" },
  { id: "rt15", category: "inbox", categoryLabel: "Hẹn inbox", title: "Inbox đặt lịch", text: "Bạn inbox mình hẹn lịch tư vấn 1-1 free nha 💕" },

  { id: "rt16", category: "spam", categoryLabel: "Chặn spam", title: "Cảnh báo nhẹ", text: "Bạn vui lòng không spam link nha, mình sẽ phải ẩn comment 🙏" },
  { id: "rt17", category: "spam", categoryLabel: "Chặn spam", title: "Yêu cầu gỡ", text: "Bạn gỡ link quảng cáo giúp mình nha, không thì mình block ạ." },
  { id: "rt18", category: "spam", categoryLabel: "Chặn spam", title: "Báo report", text: "Comment này vi phạm policy, mình sẽ report nha." },
  { id: "rt19", category: "spam", categoryLabel: "Chặn spam", title: "Ẩn comment", text: "Mình đã ẩn comment này vì có dấu hiệu spam." },
  { id: "rt20", category: "spam", categoryLabel: "Chặn spam", title: "Block luôn", text: "Đã block account spam liên tục." },
];

export interface PostVariant {
  id: string;
  content: string;
  aiScore: number;
  charCount: number;
}

export const SAMPLE_VARIANTS: PostVariant[] = [
  {
    id: "v1",
    content: "Da khô mùa hanh thì làm gì? Mình thử qua 3 loại serum dưỡng ẩm và đây là cảm nhận sau 2 tuần dùng: \n\n1. Hyaluronic Acid: thấm nhanh, không bết, hợp ban đêm.\n2. Vitamin E: hơi nặng, hợp da rất khô.\n3. Niacinamide: cấp ẩm + dịu da, ok cả ngày lẫn đêm.\n\nMình thích nhất em số 1 — bạn nào da khô thử nha!",
    aiScore: 18, charCount: 380,
  },
  {
    id: "v2",
    content: "Tip dưỡng ẩm cho da khô mà mình áp dụng suốt 1 tháng:\n\n✨ Uống đủ 2L nước/ngày\n✨ Xịt khoáng giữa các bước skincare\n✨ Mặt nạ giấy 2-3 lần/tuần\n✨ Serum HA buổi tối — đỉnh cao cấp ẩm\n\nDa mình thay đổi rõ luôn! Bạn nào cùng team da khô thì comment nha.",
    aiScore: 28, charCount: 310,
  },
  {
    id: "v3",
    content: "Ai da khô giơ tay nào! 🙋‍♀️\n\nMình từng nghĩ da khô là... khô thôi. Đến khi đi spa thì mới biết da còn bị THIẾU NƯỚC + THIẾU DẦU.\n\nGiải pháp 3 bước đơn giản:\n1. Toner cấp nước (loại không cồn)\n2. Serum HA hoặc Squalane\n3. Kem khoá ẩm thật chất\n\nTuần đầu đã thấy khác. Tháng đầu thì... wow!",
    aiScore: 22, charCount: 360,
  },
];

export interface RewriteTemplate {
  id: string;
  name: string;
  description: string;
}

export const REWRITE_TEMPLATES: RewriteTemplate[] = [
  { id: "tp1", name: "Trải nghiệm cá nhân", description: "Tôi đã thử... và kết quả là..." },
  { id: "tp2", name: "Hỏi gợi mở", description: "Bạn có biết... 3 sự thật về..." },
  { id: "tp3", name: "Top list", description: "Top 5/Top 10 cho chủ đề..." },
  { id: "tp4", name: "Tips siêu nhanh", description: "5 mẹo trong 30 giây cho..." },
  { id: "tp5", name: "Đối lập 2 lựa chọn", description: "A vs B - đâu là lựa chọn..." },
  { id: "tp6", name: "Storytelling", description: "Kể câu chuyện có mở-thân-kết..." },
  { id: "tp7", name: "How-to step by step", description: "Hướng dẫn từng bước cụ thể..." },
  { id: "tp8", name: "Mistake to avoid", description: "5 sai lầm cần tránh khi..." },
  { id: "tp9", name: "Before-After", description: "So sánh trước và sau khi..." },
  { id: "tp10", name: "Q&A format", description: "Câu hỏi thường gặp và đáp án..." },
];

export interface NotificationConfig {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

export const NOTIFICATION_TOGGLES: NotificationConfig[] = [
  { key: "post_reminder", title: "Nhắc đăng bài", description: "Đến giờ lên lịch", enabled: true },
  { key: "new_comment", title: "Comment mới cần xử lý", description: "Comment có câu hỏi hoặc phàn nàn", enabled: true },
  { key: "bot_fail", title: "Bot không xử lý được", description: "Confidence < 0.7", enabled: true },
  { key: "morning_report", title: "Báo cáo sáng (7:00)", description: "Tóm tắt công việc ngày hôm nay", enabled: true },
  { key: "weekly_summary", title: "Tóm tắt cuối tuần", description: "Chủ nhật 20:00", enabled: false },
  { key: "profile_alert", title: "Cảnh báo profile", description: "Nick checkpoint/die/idle >48h", enabled: true },
  { key: "quota_warning", title: "Quota sắp hết", description: "Còn <20% quota tháng", enabled: true },
];

export type AccountStatus = "live" | "checkpoint" | "die" | "disconnected" | "connecting";

export interface SocialAccount {
  id: string;
  uid: string;
  password: string;
  twoFaSecret: string;
  fbName: string;
  kolProfileId: string | null;
  avatarColor: string;
  status: AccountStatus;
  connectedAt: string | null;
  lastActiveAt: string | null;
  lastPostedAt: string | null;
  friends: number;
  followers: number;
  postsCount: number;
  healthScore: number;
  dailyLimit: number;
  usedToday: number;
}

export const SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: "acc1", uid: "100089234156712", password: "Linh@2024!",
    twoFaSecret: "JBSWY3DPEHPK3PXP", fbName: "Linh Nguyễn Beauty",
    kolProfileId: "p1", avatarColor: "#F5A623",
    status: "live", connectedAt: "2026-01-20", lastActiveAt: "2026-05-26T08:12:00",
    lastPostedAt: "2026-05-25T10:00:00",
    friends: 4823, followers: 22400, postsCount: 198, healthScore: 92,
    dailyLimit: 5, usedToday: 2,
  },
  {
    id: "acc2", uid: "100072918374650", password: "Hung#Mkt2025",
    twoFaSecret: "KVKFKRCPNBCC4Y3F", fbName: "Hùng MKT Tech",
    kolProfileId: "p2", avatarColor: "#2C5AA0",
    status: "checkpoint", connectedAt: "2026-01-10", lastActiveAt: "2026-05-22T14:30:00",
    lastPostedAt: "2026-05-22T14:00:00",
    friends: 2310, followers: 11200, postsCount: 76, healthScore: 54,
    dailyLimit: 5, usedToday: 0,
  },
  {
    id: "acc3", uid: "100065481920345", password: "MaiChi_mom!23",
    twoFaSecret: "GEZDGNBVGY3TQOJQ", fbName: "Mai Chi Momlife",
    kolProfileId: "p3", avatarColor: "#3FB1B5",
    status: "die", connectedAt: null, lastActiveAt: "2026-05-10T09:00:00",
    lastPostedAt: null,
    friends: 891, followers: 8100, postsCount: 34, healthScore: 12,
    dailyLimit: 5, usedToday: 0,
  },
  {
    id: "acc4", uid: "100081726354890", password: "Backup@KOL99",
    twoFaSecret: "MFRA4Y3IMFRA4Y3I", fbName: "Linh Beauty Backup",
    kolProfileId: "p1", avatarColor: "#F5A623",
    status: "disconnected", connectedAt: null, lastActiveAt: null,
    lastPostedAt: null,
    friends: 0, followers: 0, postsCount: 0, healthScore: 0,
    dailyLimit: 5, usedToday: 0,
  },
  {
    id: "acc5", uid: "100094857362010", password: "Tech#Review2026",
    twoFaSecret: "ONSWG4TFONSWG4TF", fbName: "Hùng Review Gadget",
    kolProfileId: null, avatarColor: "#6B7280",
    status: "live", connectedAt: "2026-03-01", lastActiveAt: "2026-05-26T07:45:00",
    lastPostedAt: "2026-05-25T19:00:00",
    friends: 3102, followers: 15600, postsCount: 112, healthScore: 87,
    dailyLimit: 5, usedToday: 3,
  },
];

export const ACCOUNT_STATUS_META: Record<AccountStatus, { label: string; color: string; bg: string }> = {
  live:         { label: "Live",        color: "#16a34a", bg: "rgba(22,163,74,0.12)"   },
  checkpoint:   { label: "Checkpoint",  color: "#d97706", bg: "rgba(217,119,6,0.14)"  },
  die:          { label: "Die",         color: "#dc2626", bg: "rgba(220,38,38,0.12)"  },
  disconnected: { label: "Chưa kết nối",color: "#6B7280", bg: "#E5E7EB"              },
  connecting:   { label: "Đang kết nối",color: "#2C5AA0", bg: "rgba(44,90,160,0.12)" },
};

export const KEYBOARD_SHORTCUTS = [
  { key: "J", label: "Tiếp theo" },
  { key: "K", label: "Trước" },
  { key: "A", label: "Duyệt" },
  { key: "R", label: "Sinh lại" },
  { key: "E", label: "Sửa" },
];

export const POST_STATUS_META: Record<PostStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Nháp", color: "#6B7280", bg: "#E5E7EB" },
  scheduled: { label: "Đã lên lịch", color: "#2C5AA0", bg: "rgba(44,90,160,0.12)" },
  reminded: { label: "Đã nhắc", color: "#F5A623", bg: "rgba(245,166,35,0.16)" },
  posted: { label: "Đã đăng", color: "#16a34a", bg: "rgba(22,163,74,0.14)" },
  archived: { label: "Lưu trữ", color: "#6B7280", bg: "#E5E7EB" },
};

export const MESSAGE_TYPE_META: Record<MessageType, { label: string; color: string; bg: string }> = {
  mua_hang: { label: "Mua hàng", color: "#16a34a", bg: "rgba(22,163,74,0.14)" },
  thong_tin: { label: "Thông tin", color: "#2C5AA0", bg: "rgba(44,90,160,0.12)" },
  phan_nan: { label: "Phàn nàn", color: "#E63946", bg: "rgba(230,57,70,0.12)" },
  spam: { label: "Spam", color: "#6B7280", bg: "#E5E7EB" },
};

// ─── Post Management ────────────────────────────────────────────────────────

export interface AutoPostConfig {
  profileId: string;
  enabled: boolean;
  postsPerDay: number;
  postingTimes: string[];
  daysActive: number[]; // 0=Mon … 6=Sun
  requireApproval: boolean;
  autoFromSources: boolean;
}

export const AUTO_POST_CONFIGS: AutoPostConfig[] = [
  {
    profileId: "p1", enabled: true, postsPerDay: 2,
    postingTimes: ["07:30", "20:00"],
    daysActive: [0, 1, 2, 3, 4, 5, 6],
    requireApproval: true, autoFromSources: true,
  },
  {
    profileId: "p2", enabled: true, postsPerDay: 1,
    postingTimes: ["08:00", "21:00"],
    daysActive: [0, 1, 2, 3, 4],
    requireApproval: false, autoFromSources: false,
  },
  {
    profileId: "p3", enabled: false, postsPerDay: 1,
    postingTimes: ["07:00", "13:00"],
    daysActive: [0, 1, 2, 3, 4, 5, 6],
    requireApproval: true, autoFromSources: true,
  },
];

export interface TemplateProfileConfig {
  profileId: string;
  enabled: boolean;
  templateUrl: string;
  templateLabel: string;
  autoRewrite: boolean;
  autoSchedule: boolean;
}

export const TEMPLATE_PROFILE_CONFIGS: TemplateProfileConfig[] = [
  {
    profileId: "p1", enabled: true,
    templateUrl: "https://facebook.com/beautyguru.vn",
    templateLabel: "Beauty Guru VN",
    autoRewrite: true, autoSchedule: false,
  },
  {
    profileId: "p2", enabled: false,
    templateUrl: "",
    templateLabel: "",
    autoRewrite: true, autoSchedule: false,
  },
  {
    profileId: "p3", enabled: true,
    templateUrl: "https://facebook.com/momlife.official",
    templateLabel: "Momlife Official",
    autoRewrite: true, autoSchedule: true,
  },
];

export interface ContentItem {
  id: string;
  type: "text" | "image" | "carousel" | "video";
  status: "ready" | "used" | "draft";
  score: number;
  title: string;
  date: string;
  tags: string[];
}

export const CONTENT_LIBRARY: ContentItem[] = [
  { id: "1", type: "text",     status: "ready",  score: 87, title: "Review serum vitamin C dưỡng da khô mùa hanh",   date: "20/05", tags: ["skincare", "review"]   },
  { id: "2", type: "image",    status: "ready",  score: 91, title: "Bộ ảnh routine sáng da tháng 5",                 date: "19/05", tags: ["beauty", "morning"]   },
  { id: "3", type: "carousel", status: "used",   score: 78, title: "6 bước skincare cho da dầu mùa hè",             date: "18/05", tags: ["skincare", "tips"]    },
  { id: "4", type: "video",    status: "ready",  score: 83, title: "Unboxing bộ dưỡng da mới nhất 2025",            date: "17/05", tags: ["unboxing"]            },
  { id: "5", type: "text",     status: "draft",  score: 65, title: "Top 5 toner không cồn cho da nhạy cảm",         date: "16/05", tags: ["toner", "sensitive"]  },
  { id: "6", type: "image",    status: "used",   score: 94, title: "Before & After dùng retinol 3 tháng",           date: "15/05", tags: ["retinol", "result"]   },
];

export interface ApprovalSettings {
  requireApprovalForAuto: boolean;
  requireApprovalForManual: boolean;
  notifyChannel: "telegram" | "lark" | "none";
  notifyContact: string;
  reminderAfterHours: number;
}

export const APPROVAL_SETTINGS: ApprovalSettings = {
  requireApprovalForAuto: true,
  requireApprovalForManual: false,
  notifyChannel: "telegram",
  notifyContact: "@mktkolbot",
  reminderAfterHours: 2,
};

// ─── Interaction ──────────────────────────────────────────────────────────────

export interface InteractionActionConfig {
  enabled: boolean;
  dailyLimit: number;
  emotions: string[];
  templates: string[];
}

export interface InteractionTarget {
  id: string;
  name: string;
  memberCount: number;
  active: boolean;
}

export interface InteractionChannelConfig {
  enabled: boolean;
  mode: "random" | "targeted";
  randomCount: number;
  timeStart: string;
  timeEnd: string;
  jitterMinutes: number;
  react: InteractionActionConfig;
  comment: InteractionActionConfig;
  share: { enabled: boolean; dailyLimit: number };
  targets: InteractionTarget[];
}

export interface InteractionConfig {
  profileId: string;
  group: InteractionChannelConfig;
  friend: InteractionChannelConfig;
}

const _GROUP_TEMPLATES = [
  "Thông tin hữu ích quá! 👍",
  "Mình cũng đang tìm hiểu về cái này 🥰",
  "Cảm ơn bạn đã chia sẻ!",
  "Hay quá! Follow để đọc thêm 💕",
];
const _FRIEND_TEMPLATES = [
  "Đẹp quá bạn ơi! 😍",
  "Nhìn xịn! Mua ở đâu vậy bạn?",
  "Haha đúng không! 😂",
  "Cổ vũ bạn nha! 💪",
];

export const INTERACTION_CONFIGS: InteractionConfig[] = [
  {
    profileId: "p1",
    group: {
      enabled: true, mode: "targeted", randomCount: 50,
      timeStart: "08:00", timeEnd: "21:00", jitterMinutes: 15,
      react:   { enabled: true,  dailyLimit: 30, emotions: ["like","love","haha"], templates: [] },
      comment: { enabled: true,  dailyLimit: 10, emotions: [], templates: _GROUP_TEMPLATES.slice(0,3) },
      share:   { enabled: false, dailyLimit: 2 },
      targets: [
        { id: "g1", name: "Hội Skincare VN",            memberCount: 85000,  active: true  },
        { id: "g2", name: "Review Mỹ Phẩm Thật & Giả", memberCount: 124000, active: true  },
        { id: "g3", name: "Beauty Tips Việt Nam",       memberCount: 56000,  active: false },
      ],
    },
    friend: {
      enabled: true, mode: "random", randomCount: 40,
      timeStart: "09:00", timeEnd: "22:00", jitterMinutes: 10,
      react:   { enabled: true,  dailyLimit: 50, emotions: ["like","love"], templates: [] },
      comment: { enabled: true,  dailyLimit: 15, emotions: [], templates: _FRIEND_TEMPLATES.slice(0,2) },
      share:   { enabled: false, dailyLimit: 3 },
      targets: [
        { id: "fl1", name: "Danh sách thân thiết", memberCount: 200, active: true },
        { id: "fl2", name: "Khách hàng cũ",        memberCount: 350, active: true },
      ],
    },
  },
  {
    profileId: "p2",
    group: {
      enabled: true, mode: "random", randomCount: 30,
      timeStart: "10:00", timeEnd: "20:00", jitterMinutes: 20,
      react:   { enabled: true,  dailyLimit: 20, emotions: ["like","wow"], templates: [] },
      comment: { enabled: false, dailyLimit: 5,  emotions: [], templates: [] },
      share:   { enabled: false, dailyLimit: 1 },
      targets: [
        { id: "g4", name: "Hội Công Nghệ Việt",   memberCount: 230000, active: true  },
        { id: "g5", name: "Review Điện Thoại VN",  memberCount: 89000,  active: false },
      ],
    },
    friend: {
      enabled: false, mode: "targeted", randomCount: 20,
      timeStart: "09:00", timeEnd: "21:00", jitterMinutes: 15,
      react:   { enabled: true,  dailyLimit: 30, emotions: ["like","haha"], templates: [] },
      comment: { enabled: false, dailyLimit: 10, emotions: [], templates: [] },
      share:   { enabled: false, dailyLimit: 2 },
      targets: [
        { id: "fl3", name: "Followers Tech", memberCount: 500, active: true },
      ],
    },
  },
  {
    profileId: "p3",
    group: {
      enabled: false, mode: "targeted", randomCount: 25,
      timeStart: "08:00", timeEnd: "20:00", jitterMinutes: 10,
      react:   { enabled: true,  dailyLimit: 25, emotions: ["like","love"], templates: [] },
      comment: { enabled: true,  dailyLimit: 8,  emotions: [], templates: _GROUP_TEMPLATES.slice(1,3) },
      share:   { enabled: false, dailyLimit: 1 },
      targets: [
        { id: "g6", name: "Hội Mẹ Bỉm Sữa",        memberCount: 310000, active: true },
        { id: "g7", name: "Nuôi Con Theo Khoa Học", memberCount: 145000, active: true },
      ],
    },
    friend: {
      enabled: true, mode: "targeted", randomCount: 35,
      timeStart: "08:00", timeEnd: "21:00", jitterMinutes: 5,
      react:   { enabled: true,  dailyLimit: 40, emotions: ["like","love","wow"], templates: [] },
      comment: { enabled: true,  dailyLimit: 12, emotions: [], templates: _FRIEND_TEMPLATES },
      share:   { enabled: true,  dailyLimit: 3 },
      targets: [
        { id: "fl4", name: "Nhóm mẹ bỉm thân quen", memberCount: 180, active: true },
      ],
    },
  },
];
