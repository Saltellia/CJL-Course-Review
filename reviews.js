const SUPABASE_URL = "https://uogckssolwkmvtyqslqm.supabase.co";
const SUPABASE_KEY = "sb_publishable_gLmUH3fZ9eWOO_TRflgnQw_ZGdfmknQ";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
const $ = (id) => document.getElementById(id);
const copy = {
  zh: {
    backToCourses:"课程评价与提交", about:"关于我们", heroEyebrow:"早稻田大学课程评价指南", heroDescription:"真实的课程评价，帮你找到更适合的学习方向。", searchPlaceholder:"搜索课程或教员名称（支持模糊搜索）", filterTitle:"筛选条件", level:"Level", workload:"工作量", easiness:"给分宽松度", veryLight:"超少", veryHeavy:"超多", veryStrict:"超严苛", veryEasy:"超容易", category:"课程类别", allCategories:"所有类别", resetFilters:"重置筛选", allReviews:"课程评价", viewOnly:"仅浏览", loading:"正在加载评价…", reviewCount:(n)=>`共 ${n} 条评价`, noResults:"没有找到符合条件的评价。请尝试调整筛选范围。", loadError:"评价加载失败。请检查 Supabase reviews 表的 SELECT 权限与 RLS 策略。", workloadLabel:"工作量", easinessLabel:"给分宽松度", levelLabel:"Level", reviewTag:"评价", courseFallback:"课程", studentFallback:"学生", anonymous:"匿名用户", submitted:"发布于", instructor:"教员", footerNote:"课程信息仅供选课参考，请结合个人情况判断。", searchButton:"搜索", reviewPages:"评价分页"
  },
  en: {
    backToCourses:"Course ratings & submit", about:"About", heroEyebrow:"Waseda course review guide", heroDescription:"Real student reviews to help you find the right direction.", searchPlaceholder:"Search courses or instructors", filterTitle:"Filters", level:"Level", workload:"Workload", easiness:"Grading leniency", veryLight:"Light", veryHeavy:"Heavy", veryStrict:"Strict", veryEasy:"Lenient", category:"Course category", allCategories:"All categories", resetFilters:"Reset filters", allReviews:"Course reviews", viewOnly:"View only", loading:"Loading reviews…", reviewCount:(n)=>`${n} reviews`, noResults:"No reviews match these filters. Try broadening your range.", loadError:"Could not load reviews. Check SELECT permissions and RLS policies on the Supabase reviews table.", workloadLabel:"Workload", easinessLabel:"Grading leniency", levelLabel:"Level", reviewTag:"Review", courseFallback:"Course", studentFallback:"Student", anonymous:"Anonymous", submitted:"Posted", instructor:"Instructor", footerNote:"Course reviews are a guide only; consider your own learning needs.", searchButton:"Search", reviewPages:"Review pages"
  }
};
let language = localStorage.getItem("course-review-language") || "en";
let allCourses = [];
let allReviews = [];
let categories = [];
let levelMin = 1, levelMax = 8;
const REVIEWS_PER_PAGE = 10;
let currentReviewPage = 1;
const tr = (key) => copy[language][key] ?? key;
const avg = (rows, key) => rows.length ? rows.reduce((sum, row) => sum + Number(row[key] || 0), 0) / rows.length : null;
const keyOf = (course) => String(course["Course ID"] ?? course["Course Name"] ?? "");
const categoryOf = (course) => String(course["Category"] ?? course["Course Category"] ?? course["Course Type"] ?? course["カテゴリー"] ?? "").trim();
const norm = (v) => String(v || "").trim().toLowerCase().replace(/\s+/g, "");
function applyLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => { const val = copy[language][el.dataset.i18n]; if (typeof val === "string") el.textContent = val; });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = tr(el.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(el => el.setAttribute("aria-label", tr(el.dataset.i18nAriaLabel)));
  $("languageToggle").textContent = language === "zh" ? "English" : "中文";
  renderFeed();
}
function populateCategories() {
  const select = $("reviewCategoryFilter");
  const current = select.value;
  const values = [...new Set(allCourses.map(categoryOf).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  select.replaceChildren(new Option(tr("allCategories"), ""));
  values.forEach(value => select.add(new Option(value, value)));
  if (values.includes(current)) select.value = current;
}
function selectedBounds() {
  const wMin = Number($("workloadMin").value), wMax = Number($("workloadMax").value);
  const eMin = Number($("easinessMin").value), eMax = Number($("easinessMax").value);
  return { wMin, wMax, eMin, eMax };
}
function clampRanges() {
  for (const [minId,maxId] of [["workloadMin","workloadMax"],["easinessMin","easinessMax"]]) {
    const min = $(minId), max = $(maxId);
    if (+min.value > +max.value) {
      if (document.activeElement === min) max.value = min.value; else min.value = max.value;
    }
    $(minId+"Label").textContent = min.value;
    $(maxId+"Label").textContent = max.value;
  }
  $("levelCurrent").textContent = `${levelMin}–${levelMax}`;
  document.querySelectorAll("#levelChipFilter button").forEach(button => {
    const n = Number(button.dataset.level);
    button.classList.toggle("selected", n >= levelMin && n <= levelMax);
    button.setAttribute("aria-pressed", String(n >= levelMin && n <= levelMax));
  });
}
function matchesFilters(review, course, query, bounds, category) {
  const haystack = `${course?.["Course Name"] || review.course_name || ""} ${course?.["Instructor"] || review.instructor || ""} ${review.comment || ""} ${review.display_name || ""}`.toLowerCase();
  if (query && !haystack.includes(query)) return false;
  if (category && norm(categoryOf(course || {})) !== norm(category)) return false;
  const hasLevel = review.level !== null && review.level !== undefined && review.level !== "";
  const level = Number(review.level), workload = Number(review.workload), easiness = Number(review.easiness);
  if (hasLevel && (level < levelMin || level > levelMax)) return false;
  if (!Number.isFinite(workload) || workload < bounds.wMin || workload > bounds.wMax) return false;
  if (!Number.isFinite(easiness) || easiness < bounds.eMin || easiness > bounds.eMax) return false;
  return true;
}
function renderFeed() {
  const feed = $("reviewFeed");
  if (!feed) return;
  feed.replaceChildren();
  const query = $("reviewSearchInput").value.trim().toLowerCase();
  const category = $("reviewCategoryFilter").value;
  const bounds = selectedBounds();
  const coursesByKey = new Map(allCourses.map(course => [keyOf(course), course]));
  const visible = allReviews.filter(review => matchesFilters(review, coursesByKey.get(String(review.course_id)), query, bounds, category));
  const totalPages = Math.max(1, Math.ceil(visible.length / REVIEWS_PER_PAGE));
  if (currentReviewPage > totalPages) currentReviewPage = totalPages;
  $("reviewCount").textContent = tr("reviewCount")(visible.length);
  if (!visible.length) {
    const empty = document.createElement("div"); empty.className = "feed-empty"; empty.textContent = tr("noResults"); feed.appendChild(empty); renderPagination(0); return;
  }
  const pageStart = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
  const pageReviews = visible.slice(pageStart, pageStart + REVIEWS_PER_PAGE);
  pageReviews.forEach(review => {
    const course = coursesByKey.get(String(review.course_id)) || {};
    const courseName = course["Course Name"] || review.course_name || String(review.course_id || tr("courseFallback"));
    const instructor = course["Instructor"] || review.instructor || "—";
    const related = allReviews.filter(r => String(r.course_id) === String(review.course_id));
    const article = document.createElement("article"); article.className = "feed-review-card";
    const avatar = document.createElement("div"); avatar.className = "review-avatar"; avatar.textContent = review.is_anonymous ? "?" : (review.display_name || tr("studentFallback")).trim().slice(0,1).toUpperCase();
    const main = document.createElement("div"); main.className = "feed-review-main";
    const meta = document.createElement("div"); meta.className = "feed-review-meta";
    const author = document.createElement("span"); author.className = "feed-review-author"; author.textContent = review.is_anonymous ? tr("anonymous") : (review.display_name || tr("studentFallback"));
    const date = document.createElement("span"); date.className = "feed-review-date"; date.textContent = review.created_at ? `${tr("submitted")} · ${new Date(review.created_at).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {year:"numeric",month:"short",day:"numeric"})}` : "";
    meta.append(author,date);
    const title = document.createElement("h3"); title.className = "feed-course-title"; title.textContent = courseName;
    const instructorLine = document.createElement("p"); instructorLine.className = "feed-instructor"; instructorLine.textContent = `${tr("instructor")}: ${instructor}`;
    const tags = document.createElement("div"); tags.className = "feed-tags";
    const tagValues = [review.level !== null && review.level !== undefined ? `Level ${review.level}/8` : "", categoryOf(course), review.source ? (language === "zh" ? "外部评价" : "Imported review") : tr("reviewTag")].filter(Boolean);
    tagValues.forEach(value => { const tag = document.createElement("span"); tag.textContent = value; tags.appendChild(tag); });
    const comment = document.createElement("p"); comment.className = "feed-review-comment"; comment.textContent = review.comment || "—";
    const stats = document.createElement("div"); stats.className = "feed-review-stats";
    const score1 = document.createElement("div"); score1.className = "feed-score workload-score"; score1.innerHTML = `<span>${tr("workloadLabel")}</span><strong>${Number(review.workload).toFixed(1)} / 10</strong>`;
    const score2 = document.createElement("div"); score2.className = "feed-score easiness-score"; score2.innerHTML = `<span>${tr("easinessLabel")}</span><strong>${Number(review.easiness).toFixed(1)} / 10</strong>`;
    if (review.level !== null && review.level !== undefined && review.level !== "") {
      const score3 = document.createElement("div"); score3.className = "feed-score level-score"; score3.innerHTML = `<span>${tr("levelLabel")}</span><strong>${Number(review.level).toFixed(1)} / 8</strong>`;
      stats.append(score1,score2,score3);
    } else { stats.append(score1,score2); }
    main.append(meta,title,instructorLine,tags,comment);
    article.append(avatar,main,stats); feed.appendChild(article);
  });
  renderPagination(visible.length);
}
function renderPagination(totalItems) {
  const nav = $("reviewPagination");
  if (!nav) return;
  nav.replaceChildren();
  const totalPages = Math.max(1, Math.ceil(totalItems / REVIEWS_PER_PAGE));
  if (totalPages <= 1) return;
  const makeButton = (label, page, disabled = false, active = false) => {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = label; button.disabled = disabled;
    button.className = active ? "active" : "";
    if (active) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => { currentReviewPage = page; renderFeed(); window.scrollTo({top: document.querySelector(".review-feed-area").offsetTop - 20, behavior:"smooth"}); });
    nav.appendChild(button);
  };
  makeButton(language === "zh" ? "上一页" : "Previous", Math.max(1, currentReviewPage - 1), currentReviewPage === 1);
  for (let page = 1; page <= totalPages; page++) makeButton(String(page), page, false, page === currentReviewPage);
  makeButton(language === "zh" ? "下一页" : "Next", Math.min(totalPages, currentReviewPage + 1), currentReviewPage === totalPages);
}


async function init() {
  applyLanguage();

  const [courseResult, reviewResult, externalResult] = await Promise.all([
    client.from("CJL Courses").select("*"),

    client
      .from("reviews")
      .select("id, course_id, workload, easiness, level, comment, created_at, is_anonymous, display_name")
      .order("created_at", { ascending: false }),

    client
      .from("external_reviews_with_courses")
      .select("id:review_id, course_id, course_name, instructor, category, display_name, workload, easiness, level, comment, is_anonymous, source, created_at:imported_at")
      .order("imported_at", { ascending: false })
  ]);

  if (courseResult.error) {
    console.error("Courses query failed", courseResult.error);
  }
  if (reviewResult.error) {
    console.error("Reviews query failed", reviewResult.error);
  }
  if (externalResult.error) {
    console.error("External reviews query failed", externalResult.error);
  }

  if (courseResult.error || (reviewResult.error && externalResult.error)) {
    $("reviewsStatus").textContent = tr("loadError");
    $("reviewCount").textContent = "";
    return;
  }

  allCourses = courseResult.data || [];

  const userReviews = (reviewResult.data || []).map(row => ({
    ...row,
    source: null
  }));

  const externalReviews = (externalResult.data || []).map(row => ({
    ...row,
    created_at: row.created_at,
    source: row.source || "external"
  }));

  allReviews = [...userReviews, ...externalReviews].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  populateCategories();
  clampRanges();
  renderFeed();

  $("reviewsStatus").textContent = "";
}

$("languageToggle").addEventListener("click", () => { language = language === "zh" ? "en" : "zh"; localStorage.setItem("course-review-language", language); populateCategories(); applyLanguage(); });
$("reviewSearchForm").addEventListener("submit", event => { event.preventDefault(); currentReviewPage = 1; renderFeed(); });
$("reviewSearchInput").addEventListener("input", () => { currentReviewPage = 1; renderFeed(); });
$("reviewCategoryFilter").addEventListener("change", () => { currentReviewPage = 1; renderFeed(); });
for (const id of ["workloadMin","workloadMax","easinessMin","easinessMax"]) $(id).addEventListener("input", () => { currentReviewPage = 1; clampRanges(); renderFeed(); });
document.querySelectorAll("#levelChipFilter button").forEach(button => button.addEventListener("click", () => {
  const n = Number(button.dataset.level);
  if (n < levelMin || (levelMin === 1 && levelMax === 8)) { levelMin = n; levelMax = n; }
  else if (n < levelMax && n >= levelMin) { if (n - levelMin < levelMax - n) levelMin = n; else levelMax = n; }
  else if (n > levelMax) levelMax = n;
  else if (n < levelMin) levelMin = n;
  if (levelMin > levelMax) [levelMin,levelMax] = [levelMax,levelMin];
  currentReviewPage = 1; clampRanges(); renderFeed();
}));
$("resetReviewFilters").addEventListener("click", () => {
  currentReviewPage = 1; levelMin = 1; levelMax = 8; $("workloadMin").value = 1; $("workloadMax").value = 10; $("easinessMin").value = 1; $("easinessMax").value = 10; $("reviewCategoryFilter").value = ""; $("reviewSearchInput").value = ""; clampRanges(); renderFeed();
});
init();
