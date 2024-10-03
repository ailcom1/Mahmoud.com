let timerInterval;
let totalTime = 24 * 60 * 60; // 24 ساعة بالثواني (86400 ثانية)
let points = 0;
let gems = 0;
let codeExpirationTime = null; // وقت انتهاء صلاحية الكود
let isCodeActive = false; // للتحقق مما إذا كان الكود قد تم تفعيله بنجاح
let promptCodeOnce = true; // لتحديد ما إذا كان يجب طلب الكود مرة واحدة فقط

// تخزين الأكواد وصلاحياتها
const activationCodes = {
    "jash#iw82": 1, // الكود صالح لمدة يوم واحد
    "example#code1": 3, // الكود صالح لمدة 3 أيام
    "example#code2": 5, // الكود صالح لمدة 5 أيام
    "srt": 2, // الكود صالح لمدة يومين
    "sxt": 3, // الكود صالح لمدة 3 أيام
    "HALA": 365, // الكود صالح لمدة سنة
    "snkl$": 30, // الكود صالح لمدة شهر
    "SDFAK": 7, // الكود صالح لمدة أسبوع
    "RTY": 1 // الكود صالح لمدة يوم واحد
};

function promptForCode() {
    const codePrompt = document.getElementById("codePrompt");
    codePrompt.style.display = "block"; // إظهار نافذة إدخال الكود
}

function updateExpirationDisplay() {
    const expirationDisplay = document.getElementById("expirationDisplay");
    const activationCode = document.getElementById("activationCode").value;

    if (activationCodes[activationCode]) {
        expirationDisplay.innerText = `الكود صالح لمدة ${activationCodes[activationCode]} يوم(s).`;
    } else {
        expirationDisplay.innerText = ""; // مسح عرض مدة الصلاحية
    }
}

function verifyCode() {
    const code = document.getElementById("activationCode").value;
    const errorMsg = document.getElementById("errorMsg");

    // التحقق مما إذا كان الكود قد انتهت صلاحيته أو إذا لم يتم تفعيله بعد
    if (codeExpirationTime && new Date() > codeExpirationTime) {
        errorMsg.innerText = "لقد انتهت صلاحية الكود. يرجى طلب كود جديد.";
        return;
    }

    // التحقق من صحة الكود
    if (activationCodes[code]) {
        if (!isCodeActive) {
            startTimer(); // بدء العد التنازلي إذا كان الكود صحيحًا
            document.getElementById("codePrompt").style.display = "none"; // إخفاء نافذة إدخال الكود
            codeExpirationTime = new Date(new Date().getTime() + activationCodes[code] * 24 * 60 * 60 * 1000); // صلاحية الكود بالاستناد إلى عدد الأيام
            isCodeActive = true; // تفعيل الكود
            errorMsg.innerText = ""; // إعادة تعيين رسالة الخطأ
        } else {
            errorMsg.innerText = "الكود لا يزال نشطًا.";
        }
    } else {
        errorMsg.innerText = "كود التفعيل غير صحيح. يرجى المحاولة مرة أخرى."; // إظهار رسالة الخطأ
    }
}

function startTimer() {
    const timerDisplay = document.getElementById("timer");
    const startBtn = document.getElementById("startBtn");

    // منع بدء العد التنازلي إذا كان المؤقت يعمل بالفعل
    if (timerInterval) return;

    // عرض الوقت الأولي كـ 24 ساعة
    const hours = String(Math.floor(totalTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalTime % 60).padStart(2, '0');
    timerDisplay.innerText = `${hours}:${minutes}:${seconds}`;

    startBtn.disabled = true; // تعطيل زر البدء

    timerInterval = setInterval(() => {
        if (totalTime <= 0) {
            clearInterval(timerInterval);
            completeTimer();
            return;
        }

        totalTime--;
        const hours = String(Math.floor(totalTime / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalTime % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalTime % 60).padStart(2, '0');
        timerDisplay.innerText = `${hours}:${minutes}:${seconds}`;
    }, 1000); // تحديث كل ثانية
}

function completeTimer() {
    const timerDisplay = document.getElementById("timer");
    const startBtn = document.getElementById("startBtn");

    alert("انتهى الوقت! حصلت على 100 نقطة وجوهرة.");
    points += 100;
    gems += 100;
    document.getElementById("points").innerText = points;
    document.getElementById("gems").innerText = gems;
    document.getElementById("balance").innerText = (points / 100).toFixed(2); // تحديث الرصيد بالدولار
    timerDisplay.innerText = "00:00:00"; // إعادة تعيين العرض
    startBtn.disabled = false; // إعادة تمكين زر البدء
    timerInterval = null; // إعادة تعيين timerInterval للسماح بإعادة البدء
    isCodeActive = false; // بعد انتهاء المؤقت، يصبح الكود غير نشط

    if (promptCodeOnce) {
        promptForCode(); // طلب الكود مرة واحدة فقط عند انتهاء العد التنازلي
        promptCodeOnce = false; // ضبط القيمة بحيث لا يُطلب مرة أخرى
    }
}

document.getElementById("startBtn").addEventListener("click", promptForCode);

function openTelegram() {
    window.open('https://t.me/sadhdu', '_blank'); // فتح حساب Telegram
}