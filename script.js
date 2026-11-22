// ===================================================
// DỮ LIỆU & KHỞI TẠO STATE
// ===================================================
const monthNamesVi = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

const dayNamesVi = [
    "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
];

const categoryLabels = {
    work: "💼 Công việc",
    study: "📚 Học tập",
    personal: "☕ Cá nhân",
    important: "⭐ Quan trọng"
};

// State hiện tại
let today = new Date();
let currentDisplayDate = new Date(); // Tháng / Năm đang hiển thị
let selectedDate = new Date();       // Ngày người dùng đang chọn

// Danh sách sự kiện lưu trữ
let events = [];

// ===================================================
// DOM ELEMENTS
// ===================================================
const monthYearDisplay = document.getElementById("monthYearDisplay");
const daysGrid = document.getElementById("daysGrid");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const todayBtn = document.getElementById("todayBtn");

const clockTime = document.getElementById("clockTime");
const clockDate = document.getElementById("clockDate");

const bannerSelectedDate = document.getElementById("bannerSelectedDate");
const eventCountBadge = document.getElementById("eventCountBadge");
const eventsList = document.getElementById("eventsList");

const monthTotalEvents = document.getElementById("monthTotalEvents");
const completedEventsCount = document.getElementById("completedEventsCount");

const themeToggleBtn = document.getElementById("themeToggleBtn");
const categoryFilter = document.getElementById("categoryFilter");

const openAddModalBtn = document.getElementById("openAddModalBtn");
const quickAddBtn = document.getElementById("quickAddBtn");
const eventModal = document.getElementById("eventModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const eventForm = document.getElementById("eventForm");
const modalTitle = document.getElementById("modalTitle");

const inputEventId = document.getElementById("eventId");
const inputEventTitle = document.getElementById("eventTitle");
const inputEventDate = document.getElementById("eventDate");
const inputEventCategory = document.getElementById("eventCategory");
const inputEventStartTime = document.getElementById("eventStartTime");
const inputEventEndTime = document.getElementById("eventEndTime");
const inputEventDescription = document.getElementById("eventDescription");

// ===================================================
// LOCAL STORAGE & INITIAL DATA
// ===================================================
function formatDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function loadEvents() {
    const saved = localStorage.getItem("my_calendar_events");
    if (saved) {
        try {
            events = JSON.parse(saved);
        } catch (e) {
            events = [];
        }
    } else {
        // Dữ liệu mẫu ban đầu
        const todayStr = formatDateKey(today);
        events = [
            {
                id: "ev-" + Date.now() + "-1",
                title: "Ôn tập Lập trình hướng đối tượng (C++)",
                date: todayStr,
                category: "study",
                startTime: "08:30",
                endTime: "11:00",
                description: "Ôn lại các phần Kế thừa, Đa hình và Nạp chồng toán tử.",
                completed: false
            },
            {
                id: "ev-" + Date.now() + "-2",
                title: "Họp nhóm đồ án Web",
                date: todayStr,
                category: "work",
                startTime: "14:00",
                endTime: "15:30",
                description: "Thống nhất giao diện HTML/CSS và chức năng Lịch.",
                completed: true
            }
        ];
        saveEvents();
    }
}

function saveEvents() {
    localStorage.setItem("my_calendar_events", JSON.stringify(events));
}

// ===================================================
// DIGITAL REALTIME CLOCK
// ===================================================
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    clockTime.textContent = `${hours}:${minutes}:${seconds}`;

    const dayName = dayNamesVi[now.getDay()];
    const dateNum = now.getDate();
    const monthNum = now.getMonth() + 1;
    const yearNum = now.getFullYear();
    clockDate.textContent = `${dayName}, ngày ${dateNum} tháng ${monthNum}, ${yearNum}`;
}

// ===================================================
// RENDER CALENDAR
// ===================================================
function renderCalendar() {
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();

    // Cập nhật tiêu đề tháng/năm
    monthYearDisplay.textContent = `${monthNamesVi[month]}, ${year}`;

    // Xóa lưới ngày cũ
    daysGrid.innerHTML = "";

    // Ngày đầu tiên của tháng
    const firstDayOfMonth = new Date(year, month, 1);
    // Ngày cuối cùng của tháng
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    // Thứ của ngày đầu tiên (0: CN, 1: T2, ..., 6: T7)
    // Chuyển đổi để Thứ 2 là ngày bắt đầu tuần (0: T2, 1: T3, ..., 6: CN)
    let startDayIndex = firstDayOfMonth.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6;

    // Số ngày của tháng trước
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    // 1. Render các ngày của tháng trước (Padding)
    for (let i = startDayIndex - 1; i >= 0; i--) {
        const prevDateNum = prevMonthLastDate - i;
        const prevDateObj = new Date(year, month - 1, prevDateNum);
        const dayCell = createDayCell(prevDateObj, true);
        daysGrid.appendChild(dayCell);
    }

    // 2. Render các ngày của tháng hiện tại
    for (let day = 1; day <= totalDays; day++) {
        const dateObj = new Date(year, month, day);
        const dayCell = createDayCell(dateObj, false);
        daysGrid.appendChild(dayCell);
    }

    // 3. Render các ngày của tháng tiếp theo để đủ 35 hoặc 42 ô (5 hoặc 6 hàng)
    const totalRendered = startDayIndex + totalDays;
    const totalCells = totalRendered > 35 ? 42 : 35;
    const nextDaysCount = totalCells - totalRendered;

    for (let day = 1; day <= nextDaysCount; day++) {
        const nextDateObj = new Date(year, month + 1, day);
        const dayCell = createDayCell(nextDateObj, true);
        daysGrid.appendChild(dayCell);
    }

    // Cập nhật sự kiện của ngày đang chọn & thống kê
    renderSelectedDayEvents();
    updateMonthStats();
}

function createDayCell(dateObj, isOtherMonth) {
    const cell = document.createElement("div");
    cell.className = "day-cell";
    if (isOtherMonth) cell.classList.add("other-month");

    const dateKey = formatDateKey(dateObj);
    const todayKey = formatDateKey(today);
    const selectedKey = formatDateKey(selectedDate);

    if (dateKey === todayKey) cell.classList.add("today");
    if (dateKey === selectedKey) cell.classList.add("selected");

    // Header ô ngày
    const header = document.createElement("div");
    header.className = "day-header";

    const numSpan = document.createElement("span");
    numSpan.className = "day-number";
    numSpan.textContent = dateObj.getDate();
    header.appendChild(numSpan);
    cell.appendChild(header);

    // Lọc sự kiện của ngày này
    const filterVal = categoryFilter.value;
    const dayEvents = events.filter(ev => {
        const matchDate = ev.date === dateKey;
        const matchCat = filterVal === "all" || ev.category === filterVal;
        return matchDate && matchCat;
    });

    if (dayEvents.length > 0) {
        const eventsContainer = document.createElement("div");
        eventsContainer.className = "cell-events-container";

        // Hiển thị tối đa 2 sự kiện tiêu biểu
        const displayLimit = 2;
        dayEvents.slice(0, displayLimit).forEach(ev => {
            const pill = document.createElement("div");
            pill.className = `cell-event-pill cat-${ev.category}`;
            pill.textContent = ev.title;
            eventsContainer.appendChild(pill);
        });

        if (dayEvents.length > displayLimit) {
            const more = document.createElement("div");
            more.className = "cell-more-badge";
            more.textContent = `+${dayEvents.length - displayLimit} khác`;
            eventsContainer.appendChild(more);
        }

        cell.appendChild(eventsContainer);
    }

    // Sự kiện Click chọn ngày
    cell.addEventListener("click", () => {
        selectedDate = new Date(dateObj);
        // Nếu chọn ngày ở tháng khác, tự động chuyển view sang tháng đó
        if (isOtherMonth) {
            currentDisplayDate = new Date(dateObj);
        }
        renderCalendar();
    });

    // Nhấp đúp để mở nhanh thêm sự kiện
    cell.addEventListener("dblclick", () => {
        selectedDate = new Date(dateObj);
        openModalForDate(dateKey);
    });

    return cell;
}

// ===================================================
// SIDEBAR: SỰ KIỆN TRONG NGÀY ĐANG CHỌN
// ===================================================
function renderSelectedDayEvents() {
    const selectedKey = formatDateKey(selectedDate);
    const todayKey = formatDateKey(today);

    // Banner hiển thị
    const dayName = dayNamesVi[selectedDate.getDay()];
    const dateNum = selectedDate.getDate();
    const monthNum = selectedDate.getMonth() + 1;
    const yearNum = selectedDate.getFullYear();

    if (selectedKey === todayKey) {
        bannerSelectedDate.textContent = `Hôm nay (${dateNum}/${monthNum})`;
    } else {
        bannerSelectedDate.textContent = `${dayName}, ${dateNum}/${monthNum}/${yearNum}`;
    }

    // Lọc sự kiện theo ngày & bộ lọc
    const filterVal = categoryFilter.value;
    const dayEvents = events.filter(ev => {
        const matchDate = ev.date === selectedKey;
        const matchCat = filterVal === "all" || ev.category === filterVal;
        return matchDate && matchCat;
    });

    eventCountBadge.textContent = `${dayEvents.length} sự kiện`;
    eventsList.innerHTML = "";

    if (dayEvents.length === 0) {
        eventsList.innerHTML = `
            <div class="empty-events">
                <i class="fa-regular fa-calendar-xmark"></i>
                <p>Không có sự kiện nào cho ngày này.</p>
                <p style="margin-top: 4px; font-size: 0.78rem; opacity: 0.8;">Bấm "+ Thêm" để tạo sự kiện mới!</p>
            </div>
        `;
        return;
    }

    // Sắp xếp sự kiện theo giờ bắt đầu
    dayEvents.sort((a, b) => (a.startTime || "00:00").localeCompare(b.startTime || "00:00"));

    dayEvents.forEach(ev => {
        const item = document.createElement("div");
        item.className = `event-item cat-${ev.category} ${ev.completed ? "completed" : ""}`;

        item.innerHTML = `
            <div class="event-top">
                <div class="event-title">${escapeHtml(ev.title)}</div>
                <div class="event-time">
                    <i class="fa-regular fa-clock"></i>
                    ${ev.startTime || "Cả ngày"} ${ev.endTime ? " - " + ev.endTime : ""}
                </div>
            </div>
            ${ev.description ? `<div class="event-desc">${escapeHtml(ev.description)}</div>` : ""}
            <div class="event-actions">
                <button class="event-action-btn toggle-done-btn" title="${ev.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}">
                    <i class="fa-${ev.completed ? 'solid fa-circle-check' : 'regular fa-circle'}"></i>
                </button>
                <button class="event-action-btn edit-btn" title="Chỉnh sửa">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="event-action-btn delete-btn" title="Xóa sự kiện">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        // Toggle hoàn thành
        item.querySelector(".toggle-done-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            ev.completed = !ev.completed;
            saveEvents();
            renderCalendar();
        });

        // Chỉnh sửa sự kiện
        item.querySelector(".edit-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            openModalForEdit(ev);
        });

        // Xóa sự kiện
        item.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Bạn có chắc muốn xóa sự kiện "${ev.title}"?`)) {
                events = events.filter(itemEv => itemEv.id !== ev.id);
                saveEvents();
                renderCalendar();
            }
        });

        eventsList.appendChild(item);
    });
}

// Cập nhật thống kê tháng
function updateMonthStats() {
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();

    const monthEvents = events.filter(ev => {
        const evDate = new Date(ev.date);
        return evDate.getFullYear() === year && evDate.getMonth() === month;
    });

    monthTotalEvents.textContent = monthEvents.length;
    completedEventsCount.textContent = monthEvents.filter(ev => ev.completed).length;
}

// ===================================================
// MODAL QUẢN LÝ SỰ KIỆN
// ===================================================
function openModalForDate(dateKey) {
    eventForm.reset();
    inputEventId.value = "";
    modalTitle.innerHTML = '<i class="fa-regular fa-calendar-plus"></i> Thêm sự kiện mới';
    inputEventDate.value = dateKey || formatDateKey(selectedDate);
    inputEventStartTime.value = "09:00";
    inputEventEndTime.value = "10:30";
    eventModal.classList.add("active");
    inputEventTitle.focus();
}

function openModalForEdit(ev) {
    inputEventId.value = ev.id;
    modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Chỉnh sửa sự kiện';
    inputEventTitle.value = ev.title;
    inputEventDate.value = ev.date;
    inputEventCategory.value = ev.category || "work";
    inputEventStartTime.value = ev.startTime || "";
    inputEventEndTime.value = ev.endTime || "";
    inputEventDescription.value = ev.description || "";
    eventModal.classList.add("active");
    inputEventTitle.focus();
}

function closeModal() {
    eventModal.classList.remove("active");
}

eventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = inputEventId.value;
    const title = inputEventTitle.value.trim();
    const date = inputEventDate.value;
    const category = inputEventCategory.value;
    const startTime = inputEventStartTime.value;
    const endTime = inputEventEndTime.value;
    const description = inputEventDescription.value.trim();

    if (!title || !date) return;

    if (id) {
        // Cập nhật sự kiện cũ
        const existing = events.find(ev => ev.id === id);
        if (existing) {
            existing.title = title;
            existing.date = date;
            existing.category = category;
            existing.startTime = startTime;
            existing.endTime = endTime;
            existing.description = description;
        }
    } else {
        // Thêm sự kiện mới
        const newEvent = {
            id: "ev-" + Date.now(),
            title,
            date,
            category,
            startTime,
            endTime,
            description,
            completed: false
        };
        events.push(newEvent);
    }

    saveEvents();
    closeModal();

    // Đồng bộ lại view hiển thị đến tháng của sự kiện vừa thêm
    const eventDateObj = new Date(date);
    selectedDate = eventDateObj;
    currentDisplayDate = new Date(eventDateObj);
    renderCalendar();
});

// ===================================================
// EVENT LISTENERS & ĐIỀU HƯỚNG
// ===================================================
prevMonthBtn.addEventListener("click", () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    renderCalendar();
});

todayBtn.addEventListener("click", () => {
    today = new Date();
    currentDisplayDate = new Date(today);
    selectedDate = new Date(today);
    renderCalendar();
});

categoryFilter.addEventListener("change", () => {
    renderCalendar();
});

openAddModalBtn.addEventListener("click", () => {
    openModalForDate(formatDateKey(selectedDate));
});

quickAddBtn.addEventListener("click", () => {
    openModalForDate(formatDateKey(selectedDate));
});

closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

// Đóng modal khi bấm ra ngoài vùng box
eventModal.addEventListener("click", (e) => {
    if (e.target === eventModal) closeModal();
});

// Phím tắt Esc để đóng modal
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && eventModal.classList.contains("active")) {
        closeModal();
    }
});

// Chuyển chế độ Sáng / Tối (Dark / Light Theme)
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("my_calendar_theme", isDark ? "dark" : "light");
});

function loadTheme() {
    const savedTheme = localStorage.getItem("my_calendar_theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

// Hàm bảo vệ chống XSS
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ===================================================
// KHỞI CHẠY ỨNG DỤNG
// ===================================================
function init() {
    loadTheme();
    loadEvents();
    renderCalendar();
    updateClock();
    setInterval(updateClock, 1000);
}

// Chạy khi trang tải xong
document.addEventListener("DOMContentLoaded", init);

