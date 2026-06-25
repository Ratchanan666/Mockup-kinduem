// ==========================================
// 1. IN-MEMORY APPLICATION STATE
// ==========================================

let assets = [
    {
        id: "AST-001",
        name: "Desktop Computer Dell OptiPlex 7090",
        category: "Desktop Computer",
        location: "HQ-Floor 3",
        value: 35000,
        status: "Active",
        serial: "SN-DEL99485721",
        manager: "IT Admin Team",
        borrows: [
            { date: "2026-05-10", returnDate: "2026-05-20", user: "สมชาย นักพัฒนา", action: "ยืมใช้งานเนื่องจาก PC หลักส่งซ่อม", status: "Returned" },
            { date: "2026-05-22", returnDate: "2026-05-30", user: "สมศักดิ์ ไอที", action: "ยืมทดสอบติดตั้งซอฟต์แวร์ใหม่", status: "Returned" }
        ],
        transfers: [
            { date: "2026-01-15", source: "Warehouse Branch A", dest: "HQ-Floor 3", note: "เบิกจ่ายอุปกรณ์ใหม่เข้าระบบแผนกไอที" }
        ]
    },
    {
        id: "AST-002",
        name: "MacBook Pro 16\" (M2 Max)",
        category: "Notebook",
        location: "HQ-Floor 2",
        value: 89000,
        status: "Borrowed",
        serial: "SN-APL88472910",
        manager: "IT Admin Team",
        borrows: [
            { date: "2026-06-01", returnDate: "2026-07-01", user: "กิตติพงษ์ วิศวกร", action: "ยืมพัฒนาแอปพลิเคชันระบบองค์กร", status: "Active" }
        ],
        transfers: []
    },
    {
        id: "AST-003",
        name: "HP LaserJet Enterprise MFP Printer",
        category: "Printer",
        location: "Finance Room",
        value: 42000,
        status: "Active",
        serial: "SN-HPJ22938475",
        manager: "Admin Support Team",
        borrows: [],
        transfers: [
            { date: "2026-03-01", source: "HQ-Floor 1", dest: "Finance Room", note: "โอนย้ายเพื่ออำนวยความสะดวกงานเอกสารบัญชีและการเงิน" }
        ]
    },
    {
        id: "AST-004",
        name: "Dell UltraSharp 27\" 4K Monitor",
        category: "Monitor",
        location: "HQ-Floor 2",
        value: 19500,
        status: "Overdue",
        serial: "SN-DEL66392019",
        manager: "Admin Support Team",
        borrows: [
            { date: "2026-05-15", returnDate: "2026-06-15", user: "วรรณพร การเงิน", action: "ยืมต่อจอแสดงผลแยกทำงานบัญชี", status: "Overdue" }
        ],
        transfers: []
    },
    {
        id: "AST-005",
        name: "Cisco ISR 4331 Router",
        category: "Router",
        location: "Server Room A",
        value: 120000,
        status: "Active",
        serial: "SN-CSCO4331-88A",
        manager: "Network Operation Team",
        borrows: [],
        transfers: []
    },
    {
        id: "AST-006",
        name: "Cisco Catalyst 2960-X Switch",
        category: "Switch",
        location: "Server Room B",
        value: 20000,
        status: "Active",
        serial: "SN-CSCO2960-X99",
        manager: "Network Operation Team",
        borrows: [],
        transfers: []
    }
];

let recentActivities = [
    { type: "borrow", text: "<strong>กิตติพงษ์ วิศวกร</strong> ยืมอุปกรณ์ <strong>MacBook Pro 16\"</strong>", time: "1 ชั่วโมงที่ผ่านมา" },
    { type: "transfer", text: "โอนย้าย <strong>HP LaserJet Printer</strong> ไปที่ <strong>Finance Room</strong> สำเร็จ", time: "3 วันที่ผ่านมา" },
    { type: "add", text: "เพิ่มอุปกรณ์ใหม่ <strong>Cisco Catalyst Switch</strong> เข้าคลังระบบ", time: "5 วันที่ผ่านมา" }
];

let notifications = [
    { id: 1, type: "warning", text: "อุปกรณ์ Dell Monitor (AST-004) เกินกำหนดคืน (เกินกำหนด 9 วัน)", time: "ด่วน", unread: true },
    { id: 2, type: "info", text: "MacBook Pro 16\" (AST-002) ใกล้ถึงกำหนดคืน (เหลืออีก 7 วัน)", time: "2 ชั่วโมงที่ผ่านมา", unread: true },
    { id: 3, type: "success", text: "โอนย้าย HP Printer สำเร็จ ได้รับอนุมัติโดยระบบอัตโนมัติ", time: "3 วันที่ผ่านมา", unread: false }
];

// Global Chart References (to support dynamic updates)
let assetTypeChartInst = null;
let healthChartInst = null;
let utilizationChartInst = null;

// Selected Asset ID for Details View
let selectedAssetId = "AST-001";

// Shipment mock state
let shipments = [
    {
        id: "SHP-001",
        assetId: "AST-002",
        assetName: "MacBook Pro 16\" (M2 Max)",
        recipient: "กิตติพงษ์ วิศวกร",
        destination: "สาขาพัฒนาการ (Branch 2)",
        carrier: "Kerry Express",
        trackingNo: "KER-99485721",
        status: "In Transit",
        shipDate: "2026-06-24",
        deliveryDate: "2026-06-26"
    },
    {
        id: "SHP-002",
        assetId: "AST-003",
        assetName: "HP LaserJet Enterprise MFP Printer",
        recipient: "วรรณพร การเงิน",
        destination: "สำนักงานใหญ่ ชั้น 1",
        carrier: "Flash Express",
        trackingNo: "FLA88472910",
        status: "Delivered",
        shipDate: "2026-06-22",
        deliveryDate: "2026-06-23"
    },
    {
        id: "SHP-003",
        assetId: "AST-001",
        assetName: "Desktop Computer Dell OptiPlex 7090",
        recipient: "สมชาย นักพัฒนา",
        destination: "สาขาลาดพร้าว (Branch 5)",
        carrier: "IT Messenger",
        trackingNo: "MSG-0021",
        status: "Preparing",
        shipDate: "2026-06-25",
        deliveryDate: "2026-06-26"
    }
];

// ==========================================
// 2. BOOTSTRAP / INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Initial render
    renderActivities();
    renderNotifications();
    updateDashboardStats();
    
    // Setup Forms & Event Handlers
    initEventHandlers();
});

// ==========================================
// 3. LOGIN INTERACTION
// ==========================================

const loginForm = document.getElementById("login-form");
const loginView = document.getElementById("login-view");
const appView = document.getElementById("app-view");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    
    // Check credentials (mocking logic)
    if (username.toLowerCase() === "admin") {
        // Hide Login & Show App
        loginView.style.display = "none";
        appView.style.display = "flex";
        
        // Render current asset list and charts
        renderAssetList();
        populateDropdowns();
        
        // Wait a tiny bit for the dashboard to render, then init Chart.js
        setTimeout(() => {
            initCharts();
        }, 100);
        
        // Add log
        addActivity("return", "ผู้ดูแลระบบ <strong>admin</strong> ลงชื่อเข้าใช้งานระบบเรียบร้อย", "เมื่อสักครู่");
    } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (สิทธิทดสอบคือ admin / password)");
    }
});

// Logout trigger
document.getElementById("logout-trigger").addEventListener("click", () => {
    if (confirm("คุณต้องการออกจากระบบบริหารจัดการทรัพย์สินใช่หรือไม่?")) {
        appView.style.display = "none";
        loginView.style.display = "flex";
        
        // Clean charts
        if (assetTypeChartInst) assetTypeChartInst.destroy();
        if (healthChartInst) healthChartInst.destroy();
        if (utilizationChartInst) utilizationChartInst.destroy();
    }
});

// ==========================================
// 4. TAB NAVIGATION ROUTER
// ==========================================

const sidebarItems = document.querySelectorAll(".sidebar-item");
const tabPanes = document.querySelectorAll(".tab-pane");
const pageTitle = document.getElementById("page-title");

sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
        const tab = item.getAttribute("data-tab");
        switchTab(tab);
    });
});

function switchTab(tabId, statusFilter = "All") {
    // Update Sidebar Navigation state
    sidebarItems.forEach(item => {
        if (item.getAttribute("data-tab") === tabId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Update Tab Panes visibility
    tabPanes.forEach(pane => {
        pane.classList.remove("active");
    });
    
    const targetPane = document.getElementById(`${tabId}-tab`);
    if (targetPane) {
        targetPane.classList.add("active");
    }

    // Set page header title
    const titles = {
        dashboard: "แดชบอร์ดระบบ",
        assets: "ระบบบริหารจัดการทรัพย์สินไอที",
        borrow: "บันทึกการยืมอุปกรณ์",
        transfer: "โอนย้ายสถานที่จัดเก็บอุปกรณ์",
        shipping: "ระบบติดตามการจัดส่งอุปกรณ์ (Asset Delivery Tracking)",
        details: "รายละเอียดทรัพย์สินไอทีเชิงลึก",
        reports: "รายงานภาพรวมและการใช้งานทรัพย์สิน",
        settings: "ตั้งค่าระบบและนโยบายอุปกรณ์"
    };
    pageTitle.textContent = titles[tabId] || "ระบบบริหารจัดการ IT Assets";

    // Extra trigger operations
    if (tabId === "assets") {
        if (statusFilter !== "All") {
            document.getElementById("filter-status").value = statusFilter;
        }
        renderAssetList();
    } else if (tabId === "borrow" || tabId === "transfer" || tabId === "shipping") {
        populateDropdowns();
        if (tabId === "shipping") {
            updateShippingStats();
            renderShippingList();
        }
    } else if (tabId === "reports") {
        setTimeout(() => {
            initReportsCharts();
        }, 50);
    }
    
    // Close notifications panel on navigation
    document.getElementById("notify-panel").style.display = "none";
    
    // Close mobile sidebar if open
    document.querySelector(".sidebar").classList.remove("mobile-open");
}

// ==========================================
// 5. EVENT HANDLERS & MODALS
// ==========================================

const notifyBell = document.getElementById("notify-bell");
const notifyPanel = document.getElementById("notify-panel");
const clearNotify = document.getElementById("clear-notify");

function initEventHandlers() {
    // Notification Toggle
    notifyBell.addEventListener("click", (e) => {
        e.stopPropagation();
        notifyPanel.style.display = notifyPanel.style.display === "block" ? "none" : "block";
    });
    
    document.addEventListener("click", () => {
        notifyPanel.style.display = "none";
    });
    
    notifyPanel.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    
    // Clear notifications
    clearNotify.addEventListener("click", () => {
        notifications.forEach(n => n.unread = false);
        renderNotifications();
        document.getElementById("notify-badge").style.display = "none";
    });

    // Mobile Sidebar Toggle
    document.getElementById("menu-toggle-btn").addEventListener("click", () => {
        document.querySelector(".sidebar").classList.toggle("mobile-open");
    });

    // Modal Add Asset Show/Hide
    const addAssetBtn = document.getElementById("add-asset-btn");
    const addAssetModal = document.getElementById("add-asset-modal");
    const modalClose = document.getElementById("modal-close");
    const modalCancel = document.getElementById("modal-cancel");
    
    addAssetBtn.addEventListener("click", () => {
        // Auto-generate Asset ID
        const nextId = "AST-00" + (assets.length + 1);
        document.getElementById("new-asset-id").value = nextId;
        addAssetModal.style.display = "flex";
    });
    
    const closeModal = () => {
        addAssetModal.style.display = "none";
        document.getElementById("add-asset-form").reset();
    };
    
    modalClose.addEventListener("click", closeModal);
    modalCancel.addEventListener("click", closeModal);

    // Form Submissions
    document.getElementById("add-asset-form").addEventListener("submit", handleAddAssetSubmit);
    document.getElementById("borrow-form").addEventListener("submit", handleBorrowSubmit);
    document.getElementById("transfer-form").addEventListener("submit", handleTransferSubmit);
    document.getElementById("shipping-form").addEventListener("submit", handleShippingSubmit);

    // Table Filters
    document.getElementById("asset-search").addEventListener("input", renderAssetList);
    document.getElementById("filter-category").addEventListener("change", renderAssetList);
    document.getElementById("filter-status").addEventListener("change", renderAssetList);
    
    // Global Header Search
    document.getElementById("global-search").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = e.target.value.trim();
            if (query) {
                switchTab("assets");
                document.getElementById("asset-search").value = query;
                renderAssetList();
                e.target.value = "";
            }
        }
    });

    // Transfer asset select dynamic update source location
    document.getElementById("transfer-asset-select").addEventListener("change", (e) => {
        const val = e.target.value;
        if (val) {
            const found = assets.find(a => a.id === val);
            if (found) {
                document.getElementById("transfer-source").value = found.location;
            }
        } else {
            document.getElementById("transfer-source").value = "";
        }
    });
}

// ==========================================
// 6. LOGIC & RENDERING
// ==========================================

function updateDashboardStats() {
    const total = assets.length;
    const borrowed = assets.filter(a => a.status === "Borrowed").length;
    const overdue = assets.filter(a => a.status === "Overdue").length;
    const value = assets.reduce((sum, current) => sum + current.value, 0);

    document.getElementById("stat-total-assets").textContent = total;
    document.getElementById("stat-borrowed-assets").textContent = borrowed;
    document.getElementById("stat-overdue-assets").textContent = overdue;
    
    // Format Currency
    document.getElementById("stat-asset-value").textContent = value.toLocaleString() + " ฿";
}

function renderAssetList() {
    const searchVal = document.getElementById("asset-search").value.toLowerCase();
    const catVal = document.getElementById("filter-category").value;
    const statusVal = document.getElementById("filter-status").value;

    const listBody = document.getElementById("asset-list-body");
    listBody.innerHTML = "";

    const filtered = assets.filter(a => {
        const matchesSearch = a.id.toLowerCase().includes(searchVal) || a.name.toLowerCase().includes(searchVal) || a.serial.toLowerCase().includes(searchVal);
        const matchesCategory = catVal === "All" || a.category === catVal;
        const matchesStatus = statusVal === "All" || a.status === statusVal;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (filtered.length === 0) {
        listBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; margin-bottom: 8px;"></i><br>
                    ไม่พบข้อมูลอุปกรณ์ตามตัวกรองที่เลือก
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(asset => {
        const row = document.createElement("tr");

        let statusText = "พร้อมใช้งาน";
        if (asset.status === "Borrowed") statusText = "ถูกยืมใช้งาน";
        if (asset.status === "Overdue") statusText = "เกินกำหนดส่งคืน";

        let badgeClass = "active";
        if (asset.status === "Borrowed") badgeClass = "borrowed";
        if (asset.status === "Overdue") badgeClass = "overdue";

        row.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${asset.id}</td>
            <td>
                <div>${asset.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">S/N: ${asset.serial}</div>
            </td>
            <td>${asset.category}</td>
            <td><i class="fa-solid fa-location-dot" style="color: var(--text-muted); margin-right: 6px;"></i>${asset.location}</td>
            <td><span class="badge ${badgeClass}">${statusText}</span></td>
            <td style="text-align: center;">
                <button class="action-icon-btn" onclick="showAssetDetail('${asset.id}')" title="ดูรายละเอียดเชิงลึก">
                    <i class="fa-solid fa-eye"></i> รายละเอียด
                </button>
            </td>
        `;
        listBody.appendChild(row);
    });
}

function showAssetDetail(id) {
    selectedAssetId = id;
    const found = assets.find(a => a.id === id);
    if (!found) return;

    // Switch tab view
    switchTab("details");

    // Populate static fields
    document.getElementById("detail-name").textContent = found.name;
    document.getElementById("detail-id").textContent = found.id;
    document.getElementById("detail-category").textContent = found.category;
    document.getElementById("detail-location").textContent = found.location;
    document.getElementById("detail-value").textContent = found.value.toLocaleString() + " THB";
    document.getElementById("detail-serial").textContent = found.serial;
    document.getElementById("detail-manager").textContent = found.manager;

    // Set category icons
    const iconMap = {
        "Desktop Computer": "fa-solid fa-desktop",
        "Notebook": "fa-solid fa-laptop",
        "Printer": "fa-solid fa-print",
        "Monitor": "fa-solid fa-circle-play",
        "Router": "fa-solid fa-server",
        "Switch": "fa-solid fa-ethernet"
    };
    
    // Set fallback dynamic icon class
    const fallbackIcon = document.getElementById("detail-fallback-icon");
    fallbackIcon.className = iconMap[found.category] || "fa-solid fa-computer";

    // Set Status Badge in Details
    const detailBadge = document.getElementById("detail-status");
    let statusText = "ว่าง / พร้อมใช้งาน";
    let badgeClass = "active";
    if (found.status === "Borrowed") {
        statusText = "ถูกยืมใช้งาน";
        badgeClass = "borrowed";
    } else if (found.status === "Overdue") {
        statusText = "เลยกำหนดส่งคืน";
        badgeClass = "overdue";
    }
    detailBadge.textContent = statusText;
    detailBadge.className = `badge ${badgeClass}`;

    // Draw unique Mock QR Code
    drawMockQRCode("qr-canvas", found.id + "-" + found.serial);

    // Timelines
    const borrowTimeline = document.getElementById("detail-borrow-timeline");
    const transferTimeline = document.getElementById("detail-transfer-timeline");

    borrowTimeline.innerHTML = "";
    transferTimeline.innerHTML = "";

    // 1. Render Borrow timeline
    if (found.borrows.length === 0) {
        borrowTimeline.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted); padding: 10px 0;">ไม่มีประวัติการยืม-คืนเครื่องในฐานข้อมูล</div>`;
    } else {
        found.borrows.forEach(item => {
            let statusBadgeText = item.status === "Returned" ? "คืนเครื่องสำเร็จ" : (item.status === "Overdue" ? "เลยกำหนดส่งคืน" : "กำลังถูกยืมใช้งาน");
            let badgeStyle = item.status === "Returned" ? "color: var(--status-active);" : (item.status === "Overdue" ? "color: var(--status-overdue); font-weight: 700;" : "color: var(--status-borrowed);");
            
            const div = document.createElement("div");
            div.className = "timeline-item";
            div.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${item.date} ถึง ${item.returnDate}</div>
                    <div class="timeline-user">${item.user}</div>
                    <div class="timeline-detail">
                        <span>เหตุผลการยืม: ${item.action}</span> | <span style="${badgeStyle}">${statusBadgeText}</span>
                    </div>
                </div>
            `;
            borrowTimeline.appendChild(div);
        });
    }

    // 2. Render Transfer timeline
    if (found.transfers.length === 0) {
        transferTimeline.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted); padding: 10px 0;">ไม่มีประวัติการโยกย้ายอุปกรณ์ในรอบปี</div>`;
    } else {
        found.transfers.forEach(item => {
            const div = document.createElement("div");
            div.className = "timeline-item";
            div.innerHTML = `
                <div class="timeline-dot transfer"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${item.date}</div>
                    <div class="timeline-user"><i class="fa-solid fa-arrows-left-right"></i> ${item.source} ➔ ${item.dest}</div>
                    <div class="timeline-detail">หมายเหตุ: ${item.note}</div>
                </div>
            `;
            transferTimeline.appendChild(div);
        });
    }
}

function populateDropdowns() {
    const borrowSelect = document.getElementById("borrow-asset-select");
    const transferSelect = document.getElementById("transfer-asset-select");
    const shippingSelect = document.getElementById("shipping-asset-select");

    // Borrow select options (Active only)
    if (borrowSelect) {
        borrowSelect.innerHTML = `<option value="">กรุณาเลือกอุปกรณ์ที่พร้อมให้ยืม...</option>`;
        assets.filter(a => a.status === "Active").forEach(a => {
            const opt = document.createElement("option");
            opt.value = a.id;
            opt.textContent = `${a.id} - ${a.name} [ประเภท: ${a.category}]`;
            borrowSelect.appendChild(opt);
        });
    }

    // Transfer select options (All assets)
    if (transferSelect) {
        transferSelect.innerHTML = `<option value="">กรุณาเลือกอุปกรณ์...</option>`;
        assets.forEach(a => {
            const opt = document.createElement("option");
            opt.value = a.id;
            opt.textContent = `${a.id} - ${a.name} (ที่อยู่ปัจจุบัน: ${a.location})`;
            transferSelect.appendChild(opt);
        });
    }

    // Shipping select options (All assets)
    if (shippingSelect) {
        shippingSelect.innerHTML = `<option value="">กรุณาเลือกอุปกรณ์ที่ต้องการจัดส่ง...</option>`;
        assets.forEach(a => {
            const opt = document.createElement("option");
            opt.value = a.id;
            opt.textContent = `${a.id} - ${a.name} (ที่อยู่ปัจจุบัน: ${a.location})`;
            shippingSelect.appendChild(opt);
        });
    }
}

// ==========================================
// 7. FORM SUBMISSIONS LOGIC
// ==========================================

function handleAddAssetSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("new-asset-id").value.trim();
    const name = document.getElementById("new-asset-name").value.trim();
    const category = document.getElementById("new-asset-category").value;
    const location = document.getElementById("new-asset-location").value;
    const value = parseFloat(document.getElementById("new-asset-value").value);
    const serial = document.getElementById("new-asset-serial").value.trim();

    // Check duplicate ID
    if (assets.some(a => a.id.toUpperCase() === id.toUpperCase())) {
        alert("รหัสทรัพย์สินนี้ซ้ำในระบบ โปรดตรวจสอบ");
        return;
    }

    const newAsset = {
        id: id,
        name: name,
        category: category,
        location: location,
        value: value,
        status: "Active",
        serial: serial,
        manager: "IT Admin Team",
        borrows: [],
        transfers: []
    };

    // Add to state
    assets.push(newAsset);

    // Logs & Stats
    addActivity("add", `เพิ่มอุปกรณ์คลังใหม่: <strong>${name} (${id})</strong>`, "เมื่อสักครู่");
    updateDashboardStats();
    
    // Close modal
    document.getElementById("add-asset-modal").style.display = "none";
    document.getElementById("add-asset-form").reset();
    
    // Refresh Table
    renderAssetList();
    
    // Update chart
    updateDashboardCharts();
    
    alert(`บันทึกอุปกรณ์ ${name} เข้าระบบคลังเรียบร้อยแล้ว`);
}

function handleBorrowSubmit(e) {
    e.preventDefault();
    const borrower = document.getElementById("borrower-name").value.trim();
    const dept = document.getElementById("borrower-dept").value;
    const assetId = document.getElementById("borrow-asset-select").value;
    const borrowDate = document.getElementById("borrow-date").value;
    const returnDate = document.getElementById("return-date").value;
    const purpose = document.getElementById("borrow-purpose").value.trim();

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    // Update status
    asset.status = "Borrowed";
    
    // Append borrow record
    asset.borrows.unshift({
        date: borrowDate,
        returnDate: returnDate,
        user: `${borrower} (${dept})`,
        action: purpose,
        status: "Active"
    });

    // Notify & Logs
    addActivity("borrow", `<strong>${borrower}</strong> ยืมอุปกรณ์ <strong>${asset.name}</strong>`, "เมื่อสักครู่");
    addNotification("info", `บันทึกส่งมอบ ${asset.id} ให้ผู้ยืม ${borrower} เรียบร้อย`, "เมื่อสักครู่");

    // Reset & Redirect
    updateDashboardStats();
    document.getElementById("borrow-form").reset();
    
    // Auto-update charts
    updateDashboardCharts();
    
    alert("บันทึกการทำรายการยืมอุปกรณ์เสร็จสิ้นแล้ว! ระบบปรับสถานะเครื่องเป็น ถูกยืม");
    switchTab("assets");
}

function handleTransferSubmit(e) {
    e.preventDefault();
    const assetId = document.getElementById("transfer-asset-select").value;
    const dest = document.getElementById("transfer-dest").value;
    const date = document.getElementById("transfer-date").value;
    const status = document.getElementById("transfer-status").value;
    const notes = document.getElementById("transfer-notes").value.trim();

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const source = asset.location;
    
    // Append transfer log
    asset.transfers.unshift({
        date: date,
        source: source,
        dest: dest,
        note: notes
    });

    if (status === "Approved") {
        // Change location immediately
        asset.location = dest;
        addActivity("transfer", `ย้ายพิกัดเครื่อง <strong>${asset.name}</strong> ไปที่ ${dest} (สำเร็จ)`, "เมื่อสักครู่");
        addNotification("success", `โอนย้าย ${asset.id} จาก ${source} ไปยัง ${dest} อนุมัติสำเร็จ`, "เมื่อสักครู่");
        alert("บันทึกการโอนย้ายอุปกรณ์และปรับพิกัดที่เก็บสำเร็จ!");
    } else {
        // Pending transfer
        addActivity("transfer", `ทำคำร้องขอโอนย้าย <strong>${asset.name}</strong> ➔ ${dest} (รอผู้ดูแลอนุมัติ)`, "เมื่อสักครู่");
        addNotification("warning", `มีคำร้องโอนย้ายรออนุมัติ: อุปกรณ์ ${asset.id} คลองตำแหน่งโอนย้ายปลายทาง ${dest}`, "เมื่อสักครู่");
        alert("บันทึกคำร้องขอการโอนย้ายรออนุมัติแล้ว!");
    }

    // Reset & Redirect
    updateDashboardStats();
    document.getElementById("transfer-form").reset();
    switchTab("assets");
}

// ==========================================
// 8. NOTIFICATION & RECENT ACTIVITY TIMELINES
// ==========================================

function addActivity(type, text, time) {
    recentActivities.unshift({ type, text, time });
    if (recentActivities.length > 8) recentActivities.pop();
    renderActivities();
}

function renderActivities() {
    const feed = document.getElementById("activity-feed");
    feed.innerHTML = "";
    
    const iconClassMap = {
        add: "fa-solid fa-plus add",
        borrow: "fa-solid fa-handshake borrow",
        transfer: "fa-solid fa-arrows-left-right transfer",
        return: "fa-solid fa-arrow-rotate-left return"
    };

    recentActivities.forEach(act => {
        const li = document.createElement("li");
        li.className = "activity-item";
        li.innerHTML = `
            <div class="activity-badge ${act.type}">
                <i class="${iconClassMap[act.type] || 'fa-solid fa-info'}"></i>
            </div>
            <div class="activity-info">
                <div class="activity-title">${act.text}</div>
                <div class="activity-time">${act.time}</div>
            </div>
        `;
        feed.appendChild(li);
    });
}

function addNotification(type, text, time) {
    notifications.unshift({
        id: Date.now(),
        type,
        text,
        time,
        unread: true
    });
    renderNotifications();
}

function renderNotifications() {
    const list = document.getElementById("notify-list");
    const badge = document.getElementById("notify-badge");
    list.innerHTML = "";

    const unreadCount = notifications.filter(n => n.unread).length;
    if (unreadCount > 0) {
        badge.style.display = "flex";
        badge.textContent = unreadCount;
    } else {
        badge.style.display = "none";
    }

    notifications.forEach(n => {
        const item = document.createElement("div");
        item.className = `notification-item ${n.unread ? 'unread' : ''}`;
        
        let iconHtml = '<i class="fa-solid fa-bell"></i>';
        if (n.type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
        if (n.type === 'info') iconHtml = '<i class="fa-solid fa-info"></i>';
        if (n.type === 'success') iconHtml = '<i class="fa-solid fa-circle-check"></i>';

        item.innerHTML = `
            <div class="notification-icon-wrapper ${n.type}">
                ${iconHtml}
            </div>
            <div class="notification-content">
                <div class="notification-text">${n.text}</div>
                <div class="notification-time">${n.time}</div>
            </div>
        `;
        
        item.addEventListener("click", () => {
            n.unread = false;
            renderNotifications();
            // Optional action: if contains ID, view details of asset
            const match = n.text.match(/AST-\d+/);
            if (match) {
                showAssetDetail(match[0]);
            }
        });

        list.appendChild(item);
    });
}

// ==========================================
// 9. QR CODE DRAWING LOGIC (MOCK CANVAS)
// ==========================================

function drawMockQRCode(canvasId, text) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    
    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Render QR Finder Patterns
    ctx.fillStyle = '#0f172a';
    
    function drawFinder(x, y) {
        ctx.fillRect(x, y, 18, 18);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 3, y + 3, 12, 12);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 5, y + 5, 8, 8);
    }
    
    drawFinder(2, 2); // Top-left
    drawFinder(size - 20, 2); // Top-right
    drawFinder(2, size - 20); // Bottom-left
    
    // Random mock QR Modules based on seed
    ctx.fillStyle = '#0f172a';
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
        seed += text.charCodeAt(i);
    }
    
    function seededRandom(s) {
        let x = Math.sin(s) * 10000;
        return x - Math.floor(x);
    }
    
    let blockCount = 12;
    let blockSize = Math.floor((size - 4) / blockCount);
    let startOffset = 2;
    
    for (let row = 0; row < blockCount; row++) {
        for (let col = 0; col < blockCount; col++) {
            // Keep finders empty of noise
            if ((row < 5 && col < 5) || (row < 5 && col >= blockCount - 5) || (row >= blockCount - 5 && col < 5)) {
                continue;
            }
            
            let val = seededRandom(seed + row * 13 + col * 27);
            if (val > 0.45) {
                ctx.fillRect(startOffset + col * blockSize, startOffset + row * blockSize, blockSize - 0.5, blockSize - 0.5);
            }
        }
    }
}

// ==========================================
// 10. CHART.JS VISUALIZATION CODE
// ==========================================

function getCategoryCounts() {
    const counts = {
        "Desktop Computer": 0,
        "Notebook": 0,
        "Printer": 0,
        "Monitor": 0,
        "Router": 0,
        "Switch": 0
    };
    assets.forEach(a => {
        if (counts[a.category] !== undefined) {
            counts[a.category]++;
        }
    });
    return counts;
}

function initCharts() {
    const categoryData = getCategoryCounts();
    const categories = Object.keys(categoryData);
    const counts = Object.values(categoryData);

    const ctx = document.getElementById('assetTypeChart').getContext('2d');
    
    if (assetTypeChartInst) {
        assetTypeChartInst.destroy();
    }

    assetTypeChartInst = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'จำนวนเครื่อง (Units)',
                data: counts,
                backgroundColor: [
                    'rgba(37, 99, 245, 0.75)',
                    'rgba(59, 130, 246, 0.75)',
                    'rgba(16, 185, 129, 0.75)',
                    'rgba(245, 158, 11, 0.75)',
                    'rgba(139, 92, 246, 0.75)',
                    'rgba(239, 68, 68, 0.75)'
                ],
                borderColor: [
                    '#2563eb',
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ef4444'
                ],
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateDashboardCharts() {
    if (assetTypeChartInst) {
        const categoryData = getCategoryCounts();
        assetTypeChartInst.data.datasets[0].data = Object.values(categoryData);
        assetTypeChartInst.update();
    }
}

function initReportsCharts() {
    // 1. Health Condition Chart
    const ctxHealth = document.getElementById('healthChart').getContext('2d');
    if (healthChartInst) healthChartInst.destroy();
    
    healthChartInst = new Chart(ctxHealth, {
        type: 'doughnut',
        data: {
            labels: ['ดีเยี่ยม (Good)', 'สมควรบำรุงรักษา (Fair)', 'ชำรุดรอซ่อม (Damaged)'],
            datasets: [{
                data: [4, 2, 0],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12
                    }
                }
            }
        }
    });

    // 2. Utilization Line Chart
    const ctxUtil = document.getElementById('utilizationChart').getContext('2d');
    if (utilizationChartInst) utilizationChartInst.destroy();

    utilizationChartInst = new Chart(ctxUtil, {
        type: 'line',
        data: {
            labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
            datasets: [{
                label: 'อัตราการใช้งานอุปกรณ์ (%)',
                data: [65, 70, 72, 75, 82, 85],
                fill: true,
                backgroundColor: 'rgba(37, 99, 245, 0.1)',
                borderColor: 'var(--primary)',
                tension: 0.4,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 50,
                    max: 100,
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ==========================================
// 11. SHIPPING & DELIVERY LOGIC
// ==========================================

function updateShippingStats() {
    const total = shipments.length;
    const preparing = shipments.filter(s => s.status === "Preparing").length;
    const intransit = shipments.filter(s => s.status === "In Transit").length;
    const delivered = shipments.filter(s => s.status === "Delivered").length;

    document.getElementById("stat-total-shipping").textContent = total;
    document.getElementById("stat-preparing-shipping").textContent = preparing;
    document.getElementById("stat-intransit-shipping").textContent = intransit;
    document.getElementById("stat-delivered-shipping").textContent = delivered;
}

function renderShippingList() {
    const body = document.getElementById("shipping-list-body");
    if (!body) return;
    body.innerHTML = "";

    if (shipments.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    <i class="fa-solid fa-truck" style="font-size: 2rem; margin-bottom: 8px;"></i><br>
                    ไม่มีรายการจัดส่งอุปกรณ์ในขณะนี้
                </td>
            </tr>
        `;
        return;
    }

    shipments.forEach(ship => {
        const row = document.createElement("tr");

        let statusText = "กำลังจัดเตรียม";
        let badgeClass = "borrowed"; // Orange/Yellowish
        if (ship.status === "In Transit") {
            statusText = "กำลังนำส่ง";
            badgeClass = "overdue";
        } else if (ship.status === "Delivered") {
            statusText = "จัดส่งสำเร็จ";
            badgeClass = "active";
        } else if (ship.status === "Returned") {
            statusText = "ถูกตีกลับ";
            badgeClass = "overdue";
        }

        let customBadgeStyle = "";
        if (ship.status === "In Transit") {
            customBadgeStyle = "background-color: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2);";
        }

        row.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${ship.id}</td>
            <td>
                <div style="font-weight: 500;">${ship.assetName}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">ID: ${ship.assetId}</div>
            </td>
            <td>
                <div>${ship.recipient}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i>${ship.destination}</div>
            </td>
            <td>
                <div>${ship.carrier}</div>
                <div style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${ship.trackingNo}</div>
            </td>
            <td>
                <span class="badge ${badgeClass}" style="${customBadgeStyle}">${statusText}</span>
            </td>
            <td style="text-align: center;">
                <button class="action-icon-btn" onclick="updateShipmentStatus('${ship.id}')" title="อัปเดตสถานะขนส่ง">
                    <i class="fa-solid fa-pen-to-square"></i> อัปเดต
                </button>
            </td>
        `;
        body.appendChild(row);
    });
}

function updateShipmentStatus(id) {
    const ship = shipments.find(s => s.id === id);
    if (!ship) return;

    const newStatus = prompt("กรุณากรอกสถานะใหม่:\n1 = Preparing (กำลังจัดเตรียม)\n2 = In Transit (กำลังนำส่ง)\n3 = Delivered (จัดส่งสำเร็จ)\n4 = Returned (ถูกตีกลับ)", 
        ship.status === "Preparing" ? "1" : (ship.status === "In Transit" ? "2" : (ship.status === "Delivered" ? "3" : "4"))
    );

    if (newStatus === "1") {
        ship.status = "Preparing";
    } else if (newStatus === "2") {
        ship.status = "In Transit";
    } else if (newStatus === "3") {
        ship.status = "Delivered";
        // Optionally update the asset's location to the delivery destination
        const asset = assets.find(a => a.id === ship.assetId);
        if (asset) {
            asset.location = ship.destination;
            addActivity("transfer", `อุปกรณ์ <strong>${asset.name}</strong> จัดส่งถึงปลายทาง ${ship.destination} เรียบร้อย`, "เมื่อสักครู่");
        }
    } else if (newStatus === "4") {
        ship.status = "Returned";
    } else {
        if (newStatus !== null) alert("ตัวเลือกไม่ถูกต้อง");
        return;
    }

    addNotification("info", `อัปเดตสถานะการจัดส่ง ${ship.id} เป็น ${ship.status}`, "เมื่อสักครู่");
    renderShippingList();
    updateShippingStats();
}

function handleShippingSubmit(e) {
    e.preventDefault();
    const assetId = document.getElementById("shipping-asset-select").value;
    const recipient = document.getElementById("shipping-recipient").value.trim();
    const dest = document.getElementById("shipping-dest").value.trim();
    const carrier = document.getElementById("shipping-carrier").value;
    const tracking = document.getElementById("shipping-tracking").value.trim();
    const date = document.getElementById("shipping-date").value;
    const status = document.getElementById("shipping-status").value;

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const newShip = {
        id: "SHP-00" + (shipments.length + 1),
        assetId: assetId,
        assetName: asset.name,
        recipient: recipient,
        destination: dest,
        carrier: carrier,
        trackingNo: tracking,
        status: status,
        shipDate: date,
        deliveryDate: ""
    };

    shipments.unshift(newShip);
    addActivity("transfer", `เริ่มต้นจัดส่ง <strong>${asset.name}</strong> ไปยัง ${dest} (${carrier})`, "เมื่อสักครู่");
    addNotification("success", `เปิดใบจัดส่ง ${newShip.id} เรียบร้อยแล้ว`, "เมื่อสักครู่");

    // Reset & Refresh
    document.getElementById("shipping-form").reset();
    updateShippingStats();
    renderShippingList();
    alert(`สร้างใบจัดส่ง ${newShip.id} สำเร็จ!`);
}
