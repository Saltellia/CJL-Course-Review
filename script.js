const SUPABASE_URL = "https://uogckssolwkmvtyqslqm.supabase.co";
const SUPABASE_KEY = "sb_publishable_gLmUH3fZ9eWOO_TRflgnQw_ZGdfmknQ";

// Confirm the exact student email domain(s) with Waseda before deployment.
// This is a user-interface check; database policies below also restrict review writes.
const ALLOWED_EMAIL_DOMAINS = ["waseda.jp"];

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
const $ = (id) => document.getElementById(id);

const translations = {
  en: {
    unnamedCourse:"Unnamed course", unknownInstructor:"Unknown", brand:"CJL Compass", heroEyebrow:"Waseda course review guide", heroDescription:"Real student reviews to help you find the right direction.", courseList:"Course List", courseListHelp:"Select a course to view details and write a review", courseListBadge:"Courses & Reviews", subtitle:"Course feedback platform", search:"Search courses or instructors...", browseReviews:"Browse reviews",
    filterTitle:"Filter courses", resetFilters:"Reset filters",
    allCategories:"All categories", catGrammar:"Grammar", catWrittenExpression:"Written Expression", catReadingComprehension:"Reading Comprehension", catListeningComprehension:"Listening Comprehension", catSocietyCulture:"Society and Culture", catOralExpression:"Oral Expression", catVocabulary:"Vocabulary", catBusinessJapanese:"Business Japanese", catAcademicJapanese:"Academic Japanese", catZeroBeginners:"Japanese for 'Zero' Beginners", catKanji:"Skill-based Japanese(Kanji)", catConversation:"Skill-based Japanese(Conversation)", catNihongo:"Nihongo", catComprehensiveJapanese:"Comprehensive Japanese",
    instructor:"Instructor", noResults:"No matching courses found.", noReviews:"No reviews yet", firstReview:"No reviews yet. Be the first to review this course.",
    reviews:"Reviews", back:"← Back to courses", workload:"Workload", easiness:"Grading leniency", easinessDefinition:"How leniently the instructor grades", perceivedDifficulty:"Level", level:"Level", anonymousLabel:"Publish anonymously", anonymousHelp:"Your email and account identity will not be shown with this review.", anonymousName:"Anonymous", levelHint:"Choose based on your experience · 1–8", workloadMin:"Very light", workloadMax:"Very heavy", easinessMin:"Very difficult", easinessMax:"Very easy", shareExperience:"Share your experience", shareExperienceHelp:"Specific details are more helpful to other students", anonymousDefault:"Enabled by default", profile:"Profile", nickname:"Nickname", nicknamePlaceholder:"Enter a nickname", saveNickname:"Save nickname", nicknameHelp:"This name appears on reviews that are not anonymous.", myReviews:"My reviews", editReview:"Edit review", noMyReviews:"You have not written any reviews yet.", saveChanges:"Save changes", editMode:"Editing your review", nicknameSaved:"Nickname saved.", nicknameError:"Could not save nickname. Check database permissions.", reviewUpdated:"Review updated.", reviewUpdateError:"Could not update review. Check database permissions.",
    workloadScale:"1 = light · 10 = heavy", easinessScale:"1 = difficult · 10 = easy", difficultyScale:"1 = very easy · 8 = extremely difficult", comment:"Comment",
    commentPlaceholder:"Share your experience (optional)", veryLight:"1 — Very light", light:"2 — Light", moderate:"3 — Moderate", heavy:"4 — Heavy", veryHeavy:"5 — Very heavy",
    veryDifficult:"1 — Very difficult", difficult:"2 — Difficult", easy:"4 — Easy", veryEasy:"5 — Very easy", veryLow:"1 — Very low", low:"2 — Low", average:"3 — Average", high:"4 — High", veryHigh:"5 — Very high",
    submit:"Submit review", noRatings:"No reviews yet", ratingSummary:"Level", reviewSingular:"review", reviewPlural:"reviews",
    loadError:"Could not load courses. Please check the connection and permissions.", invalidRating:"Workload and easiness must be 1–10; perceived difficulty must be 1–8.",
    loginTitle:"Student login", loginDescription:"Enter your Waseda email and click the sign-in link sent to your inbox.", emailLabel:"Waseda email", sendCode:"Send sign-in link",
    codeLabel:"Email verification code", verifyCode:"Verify and log in", changeEmail:"Use another email", signedInAs:"Signed in as", signOut:"Sign out",
    emailDomainError:"Use an approved Waseda email address.", codeSent:"A code was sent if the address is eligible. Check your inbox and spam folder.",
    loginRequired:"Sign in with your Waseda email to submit a review.", alreadyReviewed:"You have already reviewed this course with this account.",
    reviewLoadError:"Could not load reviews. Check the Supabase table and RLS policies.", reviewSaveError:"Could not save review. Check the database setup and try again.",
    reviewSaved:"Your review has been submitted.", oneReviewRule:"Each signed-in account can submit one review per course.",
    sendCodeError:"Could not send the code. Check the email settings and try again.", verifyCodeError:"That code is invalid or expired. Request a new code.",
    signedOut:"You have signed out.", signOutError:"Could not sign out. Please try again.", otpPrompt:"Enter the code from your email.",
    duplicateReview:"This account already has a review for this course.", reviewDate:"Submitted", genericError:"Something went wrong. Please try again.",
    developerLogin:"Developer login (demo testing)", developerLoginHelp:"Use a test account created in Supabase Dashboard. This does not bypass database security.", developerEmail:"Test account email", developerPassword:"Password", developerSignIn:"Sign in with test account", developerLoginError:"Test login failed. Check the email and password, and confirm the user exists in Supabase."
  },
  zh: {
    unnamedCourse:"未命名课程", unknownInstructor:"未知", brand:"CJL Compass", heroEyebrow:"早稻田大学课程评价指南", heroDescription:"真实的课程评价，帮你找到更适合的学习方向。", courseList:"课程列表", courseListHelp:"选择课程查看详情并撰写评价", courseListBadge:"课程与评价", subtitle:"课程反馈平台", search:"搜索课程名称或教员姓名……", browseReviews:"浏览评价",
    filterTitle:"筛选条件", resetFilters:"重置筛选",
    allCategories:"所有类别", catGrammar:"语法", catWrittenExpression:"书面表达", catReadingComprehension:"阅读理解", catListeningComprehension:"听力理解", catSocietyCulture:"社会与文化", catOralExpression:"口语表达", catVocabulary:"词汇", catBusinessJapanese:"商务日语", catAcademicJapanese:"学术日语", catZeroBeginners:"日语零基础入门", catKanji:"专项日语（汉字）", catConversation:"专项日语（会话）", catNihongo:"日本语（Nihongo）", catComprehensiveJapanese:"综合日语",
    instructor:"教员", noResults:"没有找到符合条件的课程。", noReviews:"暂无评价", firstReview:"暂无评价，成为第一个评价这门课程的人吧。",
    reviews:"课程评价", back:"← 返回课程列表", workload:"工作量", easiness:"给分宽松度", easinessDefinition:"教员给分松不松", perceivedDifficulty:"Level", level:"Level", anonymousLabel:"以匿名方式公开", anonymousHelp:"公开评价时不显示你的邮箱或账号身份。", anonymousName:"匿名用户", levelHint:"根据你的体感选择 1–8", workloadMin:"超少", workloadMax:"超多", easinessMin:"超严苛", easinessMax:"超容易", shareExperience:"分享课程心得", shareExperienceHelp:"内容越具体，对其他同学越有帮助", anonymousDefault:"默认开启", profile:"个人主页", nickname:"昵称", nicknamePlaceholder:"请输入昵称", saveNickname:"保存昵称", nicknameHelp:"该昵称会显示在你未匿名公开的评价中。", myReviews:"我写过的评价", editReview:"编辑评价", noMyReviews:"你还没有写过评价。", saveChanges:"保存修改", editMode:"正在编辑你的评价", nicknameSaved:"昵称已保存。", nicknameError:"昵称保存失败，请检查数据库权限。", reviewUpdated:"评价已更新。", reviewUpdateError:"评价更新失败，请检查数据库权限。",
    workloadScale:"1 = 工作量很轻 · 10 = 工作量很重", easinessScale:"1 = 很难 · 10 = 很容易", difficultyScale:"1 = 体感非常简单 · 8 = 体感非常困难", comment:"评论",
    commentPlaceholder:"分享你的课程体验（选填）", veryLight:"1 — 非常轻松", light:"2 — 轻松", moderate:"3 — 适中", heavy:"4 — 较重", veryHeavy:"5 — 非常重",
    veryDifficult:"1 — 非常困难", difficult:"2 — 困难", easy:"4 — 容易", veryEasy:"5 — 非常容易", veryLow:"1 — 非常低", low:"2 — 低", average:"3 — 一般", high:"4 — 高", veryHigh:"5 — 非常高",
    submit:"提交评价", noRatings:"暂无评价", ratingSummary:"Level", reviewSingular:"条评价", reviewPlural:"条评价",
    loadError:"课程加载失败，请检查网络连接和读取权限。", invalidRating:"工作量和容易程度必须为 1–10，体感难度必须为 1–8。",
    loginTitle:"学生登录", loginDescription:"输入早稻田邮箱，点击邮件中的登录链接即可登录。", emailLabel:"早稻田邮箱", sendCode:"发送登录链接",
    codeLabel:"邮箱验证码", verifyCode:"验证并登录", changeEmail:"更换邮箱", signedInAs:"当前登录账号：", signOut:"退出登录",
    emailDomainError:"请输入获准使用的早稻田邮箱地址。", codeSent:"如果该邮箱符合要求，验证码已发送。请检查收件箱和垃圾邮件。",
    loginRequired:"请使用早稻田邮箱登录后再提交评价。", alreadyReviewed:"你已使用当前账号评价过这门课程。",
    reviewLoadError:"评价加载失败，请检查 Supabase 数据表和 RLS 策略。", reviewSaveError:"评价保存失败，请检查数据库配置后重试。",
    reviewSaved:"评价已提交。", oneReviewRule:"每个登录账号对每门课程只能提交一条评价。",
    sendCodeError:"验证码发送失败，请检查邮箱设置后重试。", verifyCodeError:"验证码无效或已过期，请重新获取验证码。",
    signedOut:"已退出登录。", signOutError:"退出登录失败，请重试。", otpPrompt:"请输入邮件中的验证码。",
    duplicateReview:"当前账号已经评价过这门课程。", reviewDate:"提交时间", genericError:"发生错误，请重试。",
    developerLogin:"开发者登录（Demo 测试）", developerLoginHelp:"请使用在 Supabase Dashboard 中创建的测试账号。此入口不会绕过数据库安全策略。", developerEmail:"测试账号邮箱", developerPassword:"密码", developerSignIn:"使用测试账号登录", developerLoginError:"测试账号登录失败。请检查邮箱和密码，并确认该用户已在 Supabase 中创建。"
  }
};

let currentLanguage = localStorage.getItem("course-review-language") || "en";
let courses = [];
let reviews = [];
let currentCourse = null;
let currentUser = null;
let pendingEmail = "";
let editingReviewId = null;
const t = (key) => translations[currentLanguage][key] || key;

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[currentLanguage][key]) element.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel)); });
  $("languageToggle").textContent = currentLanguage === "en" ? "中文" : "English";
  $("languageToggle").setAttribute("aria-label", currentLanguage === "en" ? "Switch to Chinese" : "切换到英文");
  renderCourses();
  if (currentCourse) renderCourseDetails();
  updateAuthUI();
}

function courseKey(course) {
  // Keep the course ID as text to match the SQL table's course_id column.
  return String(course["Course ID"] ?? course["Course Name"] ?? "");
}
function getCourseCategory(course) {
  return String(course["Category"] ?? course["Course Category"] ?? course["Course Type"] ?? course["カテゴリー"] ?? "").trim();
}
function normalizeCategory(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, "");
}
function average(items, field) {
  const valid = items.filter((item) => item[field] !== null && item[field] !== undefined && item[field] !== "" && Number.isFinite(Number(item[field])));
  if (!valid.length) return null;
  return (valid.reduce((sum, item) => sum + Number(item[field]), 0) / valid.length).toFixed(1);
}
function normalizeCourseName(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}
function getCourseReviews(course) {
  const key = courseKey(course);
  const courseNames = new Set([
    course["Course Name"], course["English Title"], course["English Course Name"]
  ].map(normalizeCourseName).filter(Boolean));
  return reviews.filter((review) => {
    if (review.source === "external" || review.source) {
      const importedName = normalizeCourseName(review.course_name);
      return String(review.course_id ?? "") === key || (importedName && courseNames.has(importedName));
    }
    return String(review.course_id) === key;
  });
}
function myReviewForCourse(course) {
  if (!currentUser) return null;
  return getCourseReviews(course).find((review) => review.user_id === currentUser.id) || null;
}

async function loadCourses() {
  const { data, error } = await supabaseClient.from("CJL Courses").select("*");
  if (error) {
    console.error("Failed to load courses:", error);
    $("course-list").textContent = t("loadError");
    return;
  }
  courses = data || [];
  renderCourses();
}

async function loadReviews() {
  const [userResult, externalResult] = await Promise.all([
    supabaseClient
      .from("reviews")
      .select("id, course_id, user_id, workload, easiness, level, comment, created_at, is_anonymous, display_name")
      .order("created_at", { ascending: true }),

    supabaseClient
      .from("external_reviews_with_courses")
      .select("id:review_id, course_id, course_name, instructor, category, display_name, workload, easiness, level, comment, created_at:imported_at, is_anonymous, source")
      .order("imported_at", { ascending: true })
  ]);

  if (userResult.error) {
    console.error("Failed to load user reviews:", userResult.error);
  }

  if (externalResult.error) {
    console.error("Failed to load external reviews:", externalResult.error);
  }

  if (userResult.error && externalResult.error) {
    console.error("Both review queries failed.");
    if (currentCourse) {
      $("reviewList").textContent = t("reviewLoadError");
    }
    return false;
  }

  const userReviews = (userResult.data || []).map(row => ({
    ...row,
    source: null
  }));

  const externalReviews = (externalResult.data || []).map(row => ({
    ...row,
    course_id: row.course_id || row.course_name || "",
    created_at: row.created_at || null,
    source: row.source || "external",
    is_anonymous: row.is_anonymous ?? true
  }));

  reviews = [...userReviews, ...externalReviews].sort(
    (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
  );

  renderCourses();

  if (currentCourse) {
    renderCourseDetails();
  }

  if (currentUser) {
    renderMyReviews();
  }

  return true;
}

function getVisibleCourses() {
  const query = $("searchInput").value.trim().toLowerCase();
  const selectedCategory = $("categoryFilter").value;
  const bounds = {
    level: [Number($("levelMinFilter").value), Number($("levelMaxFilter").value)],
    workload: [Number($("workloadMinFilter").value), Number($("workloadMaxFilter").value)],
    easiness: [Number($("easinessMinFilter").value), Number($("easinessMaxFilter").value)]
  };
  return courses.filter((course) => {
    const matchesSearch = String(course["Course Name"] ?? "").toLowerCase().includes(query) ||
      String(course["Instructor"] ?? "").toLowerCase().includes(query);
    const matchesCategory = !selectedCategory || normalizeCategory(getCourseCategory(course)) === normalizeCategory(selectedCategory);
    if (!matchesSearch || !matchesCategory) return false;
    const courseReviews = getCourseReviews(course);
    for (const field of ["level", "workload", "easiness"]) {
      const [min, max] = bounds[field];
      // Keep unreviewed courses visible only while that metric is at its full default range.
      if (!courseReviews.length) {
        const defaultMax = field === "level" ? 8 : 10;
        if (min !== 1 || max !== defaultMax) return false;
        continue;
      }
      const score = average(courseReviews, field);
      // Imported reviews may not include every metric (for example, older CSV
      // reviews can have workload/easiness but no level). Missing data should
      // not make an otherwise reviewed course disappear from the course list.
      if (score == null) continue;
      if (Number(score) < min || Number(score) > max) return false;
    }
    return true;
  });
}
function updateFilterLabels() {
  for (const key of ["level", "workload", "easiness"]) {
    const min = $(key + "MinFilter"), max = $(key + "MaxFilter");
    if (Number(min.value) > Number(max.value)) {
      if (document.activeElement === min) max.value = min.value;
      else min.value = max.value;
    }
    $(key + "MinValue").textContent = min.value;
    $(key + "MaxValue").textContent = max.value;
  }
  document.querySelectorAll("#indexLevelChipFilter button").forEach((button) => {
    const n = Number(button.dataset.level);
    const active = n >= Number($("levelMinFilter").value) && n <= Number($("levelMaxFilter").value);
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderCourses() {
  const list = $("course-list");
  if (!list) return;
  list.replaceChildren();
  const visibleCourses = getVisibleCourses();
  if (!visibleCourses.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("noResults");
    list.appendChild(empty);
    return;
  }
  visibleCourses.forEach((course) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "course-card";
    card.addEventListener("click", () => openCourse(course));
    const name = document.createElement("h3");
    name.textContent = course["Course Name"] ?? t("unnamedCourse");
    const instructor = document.createElement("p");
    instructor.textContent = `${t("instructor")}: ${course["Instructor"] ?? t("unknownInstructor")}`;
    const courseReviews = getCourseReviews(course);
    const ratings = document.createElement("div");
    ratings.className = "course-card-ratings";
    const ratingItems = [
      ["workload", t("workload")],
      ["easiness", t("easiness")],
      ["level", t("perceivedDifficulty")]
    ];
    ratingItems.forEach(([field, label]) => {
      const item = document.createElement("div");
      item.className = "course-card-rating";
      const ratingLabel = document.createElement("span");
      ratingLabel.className = "course-card-rating-label";
      ratingLabel.textContent = label;
      const ratingValue = document.createElement("strong");
      ratingValue.className = "course-card-rating-value";
      ratingValue.textContent = average(courseReviews, field) ?? "—";
      item.append(ratingLabel, ratingValue);
      ratings.appendChild(item);
    });
    const stats = document.createElement("p");
    stats.className = "course-card-stats";
    stats.textContent = courseReviews.length
      ? `${courseReviews.length} ${courseReviews.length === 1 ? t("reviewSingular") : t("reviewPlural")}`
      : t("noReviews");
    card.append(name, instructor, ratings, stats);
    list.appendChild(card);
  });
}
function openCourse(course) {
  currentCourse = course;
  $("detailCourseName").textContent = course["Course Name"] ?? t("unnamedCourse");
  $("detailInstructor").textContent = `${t("instructor")}: ${course["Instructor"] ?? t("unknownInstructor")}`;
  renderCourseDetails();
  $("courseDetails").classList.remove("hidden");
  document.body.classList.add("modal-open");
  $("backButton").focus();
}
function closeCourse() {
  $("courseDetails").classList.add("hidden");
  document.body.classList.remove("modal-open");
  currentCourse = null;
}
function renderCourseDetails() {
  if (!currentCourse) return;
  const courseReviews = getCourseReviews(currentCourse);
  $("detailWorkload").textContent = average(courseReviews, "workload") ?? "—";
  $("detailEasiness").textContent = average(courseReviews, "easiness") ?? "—";
  $("detailPerceivedDifficulty").textContent = average(courseReviews, "level") ?? "—";
  const list = $("reviewList");
  list.replaceChildren();
  if (!courseReviews.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("firstReview");
    list.appendChild(empty);
  } else {
    // Show the seven most recent reviews for this course, including imported reviews.
    [...courseReviews].reverse().slice(0, 7).forEach((review) => {
      const article = document.createElement("article");
      article.className = "review-item";
      const ratings = document.createElement("p");
      ratings.className = "review-ratings";
      const ratingParts = [];
      if (review.workload !== null && review.workload !== undefined && review.workload !== "") ratingParts.push(`${t("workload")}: ${review.workload}/10`);
      if (review.easiness !== null && review.easiness !== undefined && review.easiness !== "") ratingParts.push(`${t("easiness")}: ${review.easiness}/10`);
      if (review.level !== null && review.level !== undefined && review.level !== "") ratingParts.push(`${t("level")}: ${review.level}/8`);
      ratings.textContent = ratingParts.join(" · ");
      if (ratingParts.length) article.appendChild(ratings);
      if (review.comment) {
        const comment = document.createElement("p");
        comment.textContent = review.comment;
        article.appendChild(comment);
      }
      const author = document.createElement("small");
      author.className = "muted review-author";
      author.textContent = review.is_anonymous ? t("anonymousName") : (review.display_name || (review.source ? (currentLanguage === "zh" ? "外部评价" : "External review") : t("reviewDate")));
      article.appendChild(author);
      const date = document.createElement("small");
      date.className = "muted";
      date.textContent = review.created_at ? `${t("reviewDate")}: ${new Date(review.created_at).toLocaleString()}` : "";
      article.appendChild(date);
      list.appendChild(article);
    });
  }

  const ownReview = myReviewForCourse(currentCourse);
  $("reviewForm").classList.toggle("hidden", !currentUser || (Boolean(ownReview) && !editingReviewId));
  if (!currentUser) {
    $("reviewAccessMessage").textContent = t("loginRequired");
    $("reviewAccessMessage").classList.remove("hidden");
  } else if (ownReview && !editingReviewId) {
    $("reviewAccessMessage").textContent = t("alreadyReviewed");
    $("reviewAccessMessage").classList.remove("hidden");
  } else {
    $("reviewAccessMessage").textContent = "";
    $("reviewAccessMessage").classList.add("hidden");
  }
}
function updateAuthUI() {
  const signedIn = Boolean(currentUser);
  $("signedOutView").classList.toggle("hidden", signedIn);
  $("signedInView").classList.toggle("hidden", !signedIn);
  $("signedInEmail").textContent = currentUser?.email || "";
  $("profileButton").classList.toggle("hidden", !signedIn);
  if (currentCourse) renderCourseDetails();
}

function isAllowedEmail(email) {
  const parts = String(email || "").trim().toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return ALLOWED_EMAIL_DOMAINS.some((allowed) => domain === allowed || domain.endsWith("." + allowed));
}

$("sendCodeForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = $("emailInput").value.trim().toLowerCase();
  const message = $("authMessage");
  message.textContent = "";
  if (!isAllowedEmail(email)) {
    message.textContent = t("emailDomainError");
    return;
  }
  $("sendCodeButton").disabled = true;
  try {
    // Must be served through Live Server / a web host, not file://.
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo
      }
    });
    if (error) throw error;
    message.textContent = currentLanguage === "zh"
      ? "如果邮箱符合要求，登录链接已发送。请打开邮件并点击链接。"
      : "If the address is eligible, a sign-in link has been sent. Open the email and click the link.";
  } catch (error) {
    console.error("Magic Link send failed:", error);
    message.textContent = t("sendCodeError");
  } finally {
    $("sendCodeButton").disabled = false;
  }
});

$("developerLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = $("developerEmailInput").value.trim().toLowerCase();
  const password = $("developerPasswordInput").value;
  const message = $("developerAuthMessage");
  message.textContent = "";
  $("developerLoginButton").disabled = true;
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    currentUser = data.user || data.session?.user || null;
    message.textContent = "";
    $("developerPasswordInput").value = "";
    updateAuthUI();
    await loadReviews();
  } catch (error) {
    console.error("Developer test login failed:", error);
    message.textContent = t("developerLoginError");
  } finally {
    $("developerLoginButton").disabled = false;
  }
});

$("signOutButton").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error("Sign-out failed:", error);
    $("authMessage").textContent = t("signOutError");
    return;
  }
  currentUser = null;
  closeProfile();
  $("authMessage").textContent = t("signedOut");
  updateAuthUI();
  await loadReviews();
});
$("reviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentCourse || !currentUser) {
    alert(t("loginRequired"));
    return;
  }
  if (!editingReviewId && myReviewForCourse(currentCourse)) {
    alert(t("alreadyReviewed"));
    renderCourseDetails();
    return;
  }
  const review = {
    course_id: courseKey(currentCourse),
    user_id: currentUser.id,
    workload: Number($("workloadInput").value),
    easiness: Number($("easinessInput").value),
    level: Number($("perceivedDifficultyInput").value),
    comment: $("commentInput").value.trim() || null,
    is_anonymous: $("anonymousInput").checked,
    display_name: currentUser.user_metadata?.nickname || null
  };
  if ((review.workload < 1 || review.workload > 10 || review.easiness < 1 || review.easiness > 10 || review.level < 1 || review.level > 8)) {
    alert(t("invalidRating"));
    return;
  }
  $("submitReviewButton").disabled = true;
  try {
    let result;
    if (editingReviewId) {
      result = await supabaseClient.from("reviews").update(review).eq("id", editingReviewId).eq("user_id", currentUser.id);
    } else {
      result = await supabaseClient.from("reviews").insert(review);
    }
    const { error } = result;
    if (error) {
      if (error.code === "23505") throw new Error("DUPLICATE_REVIEW");
      throw error;
    }
    const wasEditing = Boolean(editingReviewId);
    editingReviewId = null;
    $("submitReviewButton").textContent = t("submit");
    $("commentInput").value = "";
    $("anonymousInput").checked = true;
    $("reviewForm").reset();
    await loadReviews();
    if (wasEditing) { closeCourse(); renderMyReviews(); }
    renderCourseDetails();
    renderCourses();
    alert(wasEditing ? t("reviewUpdated") : t("reviewSaved"));
  } catch (error) {
    console.error("Review submission failed:", error);
    alert(error.message === "DUPLICATE_REVIEW" ? t("duplicateReview") : (editingReviewId ? t("reviewUpdateError") : t("reviewSaveError")));
  } finally {
    $("submitReviewButton").disabled = false;
  }
});

// Keep the visual sliders and segmented Level buttons synchronized with the form values.
function syncRatingControl(sliderId, selectId, valueId) {
  const slider = $(sliderId), select = $(selectId), value = $(valueId);
  const sync = (next) => { select.value = String(next); slider.value = String(next); value.textContent = String(next); };
  slider.addEventListener("input", () => sync(slider.value));
  select.addEventListener("change", () => sync(select.value));
  sync(select.value);
}
syncRatingControl("workloadSlider", "workloadInput", "workloadValue");
syncRatingControl("easinessSlider", "easinessInput", "easinessValue");
document.querySelectorAll(".level-button").forEach((button) => {
  button.addEventListener("click", () => {
    $("perceivedDifficultyInput").value = button.dataset.level;
    document.querySelectorAll(".level-button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
  });
});
$("reviewForm").addEventListener("reset", () => {
  setTimeout(() => {
    $("workloadSlider").value = $("workloadInput").value;
    $("workloadValue").textContent = $("workloadInput").value;
    $("easinessSlider").value = $("easinessInput").value;
    $("easinessValue").textContent = $("easinessInput").value;
    const level = $("perceivedDifficultyInput").value;
    document.querySelectorAll(".level-button").forEach((button) => {
      const active = button.dataset.level === level;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }, 0);
});

function openProfile() {
  if (!currentUser) return;
  $("profilePanel").classList.remove("hidden");
  $("profileBackdrop").classList.remove("hidden");
  $("profileEmail").textContent = currentUser.email || "";
  $("nicknameInput").value = currentUser.user_metadata?.nickname || "";
  $("nicknameMessage").textContent = "";
  renderMyReviews();
}
function closeProfile() { $("profilePanel").classList.add("hidden"); $("profileBackdrop").classList.add("hidden"); }
function renderMyReviews() {
  const list = $("myReviewsList"); if (!list) return; list.replaceChildren();
  const mine = reviews.filter((review) => currentUser && review.user_id === currentUser.id).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  if (!mine.length) { const empty = document.createElement("p"); empty.className = "muted"; empty.textContent = t("noMyReviews"); list.appendChild(empty); return; }
  mine.forEach((review) => {
    const card = document.createElement("article"); card.className = "my-review-card";
    const course = courses.find((item) => courseKey(item) === String(review.course_id));
    const title = document.createElement("strong"); title.textContent = course?.["Course Name"] || String(review.course_id); card.appendChild(title);
    const score = document.createElement("p"); score.className = "muted"; score.textContent = `${t("workload")}: ${review.workload}/10 · ${t("easiness")}: ${review.easiness}/10 · ${t("level")}: ${review.level}/8`; card.appendChild(score);
    const body = document.createElement("p"); body.textContent = review.comment || "—"; card.appendChild(body);
    const button = document.createElement("button"); button.type = "button"; button.className = "secondary-button"; button.textContent = t("editReview");
    button.addEventListener("click", () => startEditingReview(review)); card.appendChild(button); list.appendChild(card);
  });
}
function startEditingReview(review) {
  currentCourse = courses.find((item) => courseKey(item) === String(review.course_id));
  if (!currentCourse) return;
  closeProfile();
  editingReviewId = review.id;
  $("courseDetails").classList.remove("hidden"); document.body.classList.add("modal-open");
  renderCourseDetails();
  $("reviewForm").classList.remove("hidden"); $("reviewAccessMessage").classList.add("hidden");
  $("workloadInput").value = String(review.workload); $("easinessInput").value = String(review.easiness); $("perceivedDifficultyInput").value = String(review.level);
  $("workloadSlider").value = String(review.workload); $("workloadValue").textContent = String(review.workload);
  $("easinessSlider").value = String(review.easiness); $("easinessValue").textContent = String(review.easiness);
  document.querySelectorAll(".level-button").forEach((button) => { const active = button.dataset.level === String(review.level); button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
  $("commentInput").value = review.comment || ""; $("anonymousInput").checked = Boolean(review.is_anonymous); $("submitReviewButton").textContent = t("saveChanges");
  window.scrollTo({top:0, behavior:"smooth"});
}
$("profileButton").addEventListener("click", openProfile);
$("closeProfileButton").addEventListener("click", closeProfile);
$("profileBackdrop").addEventListener("click", closeProfile);
$("nicknameForm").addEventListener("submit", async (event) => {
  event.preventDefault(); if (!currentUser) return;
  const nickname = $("nicknameInput").value.trim();
  if (nickname.length > 40) return;
  const { data, error } = await supabaseClient.auth.updateUser({ data: { nickname: nickname || null } });
  if (error) { $("nicknameMessage").textContent = t("nicknameError"); console.error(error); return; }
  currentUser = data.user || currentUser;
  const { error: updateError } = await supabaseClient.from("reviews").update({display_name: nickname || null}).eq("user_id", currentUser.id);
  if (updateError) { console.error(updateError); $("nicknameMessage").textContent = t("nicknameError"); return; }
  reviews = reviews.map((review) => review.user_id === currentUser.id ? {...review, display_name: nickname || null} : review);
  $("nicknameMessage").textContent = t("nicknameSaved"); renderMyReviews(); if (currentCourse) renderCourseDetails();
});

document.querySelectorAll("#indexLevelChipFilter button").forEach((button) => {
  button.addEventListener("click", () => {
    const n = Number(button.dataset.level);
    let min = Number($("levelMinFilter").value), max = Number($("levelMaxFilter").value);
    if (min === 1 && max === 8) { min = n; max = n; }
    else if (n < min) min = n;
    else if (n > max) max = n;
    else if (min === max && n === min) { min = 1; max = 8; }
    else if (n - min <= max - n) min = n; else max = n;
    $("levelMinFilter").value = String(min); $("levelMaxFilter").value = String(max);
    updateFilterLabels(); renderCourses();
  });
});
$("searchInput").addEventListener("input", renderCourses);
$("categoryFilter").addEventListener("change", renderCourses);
for (const id of ["levelMinFilter", "levelMaxFilter", "workloadMinFilter", "workloadMaxFilter", "easinessMinFilter", "easinessMaxFilter"]) {
  $(id).addEventListener("input", () => { updateFilterLabels(); renderCourses(); });
}
$("resetFiltersButton").addEventListener("click", () => {
  $("levelMinFilter").value = 1; $("levelMaxFilter").value = 8;
  $("workloadMinFilter").value = 1; $("workloadMaxFilter").value = 10;
  $("easinessMinFilter").value = 1; $("easinessMaxFilter").value = 10;
  $("categoryFilter").value = ""; $("searchInput").value = "";
  updateFilterLabels(); renderCourses();
});
updateFilterLabels();
$("backButton").addEventListener("click", closeCourse);
$("languageToggle").addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "zh" : "en";
  localStorage.setItem("course-review-language", currentLanguage);
  applyLanguage();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && currentCourse) closeCourse();
});

supabaseClient.auth.onAuthStateChange((_event, session) => {
  // Defer database calls to avoid doing additional Supabase work inside the auth callback.
  queueMicrotask(async () => {
    currentUser = session?.user || null;
    updateAuthUI();
    await loadReviews();
  });
});

async function init() {
  applyLanguage();
  const { data: { session } } = await supabaseClient.auth.getSession();
  currentUser = session?.user || null;
  updateAuthUI();
  await Promise.all([loadCourses(), loadReviews()]);
}
init();
