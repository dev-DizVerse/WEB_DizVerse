"use client";
import { useState, useEffect } from "react";

// ===================== DATA =====================
const currentStaff = {
  id: 3,
  name: "Wilbur Hackett",
  email: "wilbur@yahoo.com",
  role: "UI Designer",
  dept: "creative",
  joined: "Feb 2021",
  salary: "$4,500",
  avatar: "WH",
  phone: "+1 (555) 234-5678",
  location: "New York, USA",
};

const DEPT_COLORS: Record<string, string> = {
  operations: "#3B82F6",
  creative: "#10B981",
  sales: "#F59E0B",
  development: "#06B6D4",
  marketing: "#8B5CF6",
};

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function makeDate(year: number, month: number, day: number) {
  return new Date(year, month, day).toISOString().split("T")[0];
}
const now = new Date();
const y = now.getFullYear();
const m = now.getMonth();

const myLeaveApplications: any[] = [];

const mySchedules: any[] = [];

const myProjects: any[] = [];

const payslips: any[] = [];

const teamMembers: any[] = [];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ===================== HELPERS =====================
function getInitials(name: string) { return name.split(" ").map(n => n[0]).join("").toUpperCase(); }
function getAvatarColor(name: string) {
  const colors = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#06B6D4"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ===================== LEAVE APPLY MODAL =====================
function LeaveModal({ onClose, onSubmit }: any) {
  const [form, setForm] = useState({ type: "Annual Leave", from: "", to: "", reason: "" });
  const [error, setError] = useState("");

  function calcDays() {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to).getTime() - new Date(form.from).getTime()) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  }

  function handleSubmit() {
    if (!form.from || !form.to || !form.reason.trim()) { setError("All fields are required."); return; }
    if (new Date(form.to) < new Date(form.from)) { setError("End date must be after start date."); return; }
    onSubmit({ ...form, days: calcDays(), status: "Pending", applied: new Date().toISOString().split("T")[0] });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl p-6 w-[440px] shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg">Apply for Leave</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        {error && <p className="text-xs text-red-500 mb-3 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Leave Type *</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 transition bg-white text-gray-800">
              {["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave", "Unpaid Leave"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">From *</label>
              <input type="date" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 text-gray-800 transition" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">To *</label>
              <input type="date" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 text-gray-800 transition" />
            </div>
          </div>
          {calcDays() > 0 && (
            <div className="bg-indigo-50 rounded-xl px-4 py-2.5 text-sm text-indigo-700 font-medium">
              📅 {calcDays()} day{calcDays() !== 1 ? "s" : ""} selected
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Reason *</label>
            <textarea placeholder="Describe reason for leave..." value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 text-gray-800 transition resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">Submit Application</button>
        </div>
      </div>
    </div>
  );
}

// ===================== PAGES =====================

// ---- HOME ----
function HomePage({ leaves }: any) {
  const today = new Date();
  const upcomingSchedules = mySchedules
    .filter(s => new Date(s.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const pendingLeave = leaves.find((l: any) => l.status === "Pending");
  const approvedLeaves = leaves.filter((l: any) => l.status === "Approved").length;
  const totalDaysUsed = leaves.filter((l: any) => l.status === "Approved").reduce((s: number, l: any) => s + l.days, 0);
  const leaveBalance = 20 - totalDaysUsed;

  const greetingHour = today.getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {/* Hero greeting */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white opacity-5 -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 right-16 w-24 h-24 rounded-full bg-white opacity-5 translate-y-8"></div>
        <p className="text-indigo-200 text-sm mb-1">{greeting} 👋</p>
        <h1 className="text-2xl font-bold mb-1">{currentStaff.name}</h1>
        <p className="text-indigo-200 text-sm">{currentStaff.role} · Creative Department</p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-bold">{leaveBalance}</p>
            <p className="text-xs text-indigo-200">Leave Days Left</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-bold">{myProjects.length}</p>
            <p className="text-xs text-indigo-200">Active Projects</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-center">
            <p className="text-lg font-bold">{upcomingSchedules.length}</p>
            <p className="text-xs text-indigo-200">Upcoming Meetings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-start">
        {/* Upcoming schedule */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">📅 Upcoming Meetings</h2>
          {upcomingSchedules.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No upcoming meetings</p>
          ) : upcomingSchedules.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition mb-2">
              <div className="w-1.5 h-12 rounded-full shrink-0" style={{ backgroundColor: s.color }}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                <p className="text-xs text-gray-400">{new Date(s.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {s.time}</p>
              </div>
              {s.isLead && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium shrink-0">Lead</span>}
            </div>
          ))}
        </div>

        {/* My Projects */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">🗂️ My Projects</h2>
          {myProjects.map(p => (
            <div key={p.id} className="p-3 rounded-xl hover:bg-gray-50 transition mb-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                {p.isLead && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">Lead</span>}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400">📅 {p.deadline}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.priority === "High" ? "bg-red-50 text-red-500" : "bg-yellow-50 text-yellow-600"}`}>{p.priority}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${p.progress}%` }}></div>
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{p.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave status */}
        {pendingLeave && (
          <div className="col-span-2 bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-2xl">⏳</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-purple-800">Leave Application Pending</p>
              <p className="text-xs text-purple-500">{pendingLeave.type} · {pendingLeave.from} → {pendingLeave.to} · {pendingLeave.days} days</p>
            </div>
            <span className="text-xs bg-purple-200 text-purple-700 px-3 py-1 rounded-full font-medium">Awaiting Approval</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- LEAVE PAGE ----
function LeavePage({ leaves, onApply }: any) {
  const approvedDays = leaves.filter((l: any) => l.status === "Approved").reduce((s: number, l: any) => s + l.days, 0);
  const leaveBalance = 20 - approvedDays;
  const pendingCount = leaves.filter((l: any) => l.status === "Pending").length;

  const statusStyle: Record<string, string> = {
    Approved: "bg-green-50 text-green-600",
    Declined: "bg-red-50 text-red-500",
    Pending: "bg-purple-50 text-purple-600",
  };
  const leaveTypes = [
    { type: "Annual Leave", total: 20, used: approvedDays, color: "#6366F1" },
    { type: "Sick Leave", total: 10, used: leaves.filter((l: any) => l.type === "Sick Leave" && l.status === "Approved").reduce((s: number, l: any) => s + l.days, 0), color: "#F59E0B" },
    { type: "Emergency Leave", total: 5, used: leaves.filter((l: any) => l.type === "Emergency Leave" && l.status === "Approved").reduce((s: number, l: any) => s + l.days, 0), color: "#EF4444" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Leave</h1>
          <p className="text-sm text-gray-400">Track and apply for leave</p>
        </div>
        <button onClick={onApply} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition">+ Apply Leave</button>
      </div>

      {/* Leave balance cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {leaveTypes.map(lt => {
          const remaining = lt.total - lt.used;
          const pct = Math.min((lt.used / lt.total) * 100, 100);
          return (
            <div key={lt.type} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500">{lt.type}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: lt.color + "20", color: lt.color }}>{remaining} left</span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{lt.used} <span className="text-sm font-normal text-gray-400">/ {lt.total} days</span></p>
              <div className="bg-gray-100 rounded-full h-2 mt-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: lt.color }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applications table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Leave Applications</h3>
          {pendingCount > 0 && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-semibold">{pendingCount} Pending</span>}
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">{["Type", "Period", "Days", "Applied On", "Status"].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-400 px-5 py-4 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>
            {leaves.map((l: any, i: number) => (
              <tr key={l.id} className={`hover:bg-gray-50 transition ${i !== leaves.length - 1 ? "border-b border-gray-50" : ""}`}>
                <td className="px-5 py-4 text-sm font-medium text-gray-700">{l.type}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{l.from} → {l.to}</td>
                <td className="px-5 py-4 text-sm font-bold text-gray-700">{l.days}</td>
                <td className="px-5 py-4 text-sm text-gray-400">{l.applied}</td>
                <td className="px-5 py-4"><span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle[l.status]}`}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {leaves.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No leave applications yet</div>}
      </div>
    </div>
  );
}

// ---- SCHEDULE PAGE ----
function SchedulePage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function dateStr(day: number) {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const schedulesOnDay = (day: number) => mySchedules.filter(s => s.date === dateStr(day));
  const selectedSchedules = mySchedules.filter(s => s.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  const isToday = (day: number) => dateStr(day) === today.toISOString().split("T")[0];
  const isSelected = (day: number) => dateStr(day) === selectedDate;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Schedule</h1>
        <p className="text-sm text-gray-400">Your meetings and events</p>
      </div>
      <div className="flex gap-6 items-start">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-80 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">{MONTHS[currentMonth]} {currentYear}</h3>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition flex items-center justify-center">←</button>
              <button onClick={nextMonth} className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition flex items-center justify-center">→</button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const daySchedules = schedulesOnDay(day);
              const selected = isSelected(day);
              const todayFlag = isToday(day);
              return (
                <div key={day} onClick={() => setSelectedDate(dateStr(day))}
                  className={`relative flex flex-col items-center py-1.5 rounded-xl cursor-pointer transition ${selected ? "bg-indigo-600" : todayFlag ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
                  <span className={`text-xs font-semibold ${selected ? "text-white" : todayFlag ? "text-indigo-600" : "text-gray-700"}`}>{day}</span>
                  {daySchedules.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {daySchedules.slice(0, 3).map((s, si) => (
                        <span key={si} className="w-1 h-1 rounded-full" style={{ backgroundColor: selected ? "white" : s.color }}></span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </h3>
            <span className="text-xs text-gray-400">{selectedSchedules.length} event{selectedSchedules.length !== 1 ? "s" : ""}</span>
          </div>
          {selectedSchedules.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
              <p className="text-3xl mb-3">📅</p>
              <p className="text-sm font-semibold text-gray-500">No events on this day</p>
            </div>
          ) : selectedSchedules.map(event => (
            <div key={event.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition mb-3">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full rounded-full min-h-14 shrink-0" style={{ backgroundColor: event.color }}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-800">{event.name}</h4>
                      {event.isLead && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">You're leading</span>}
                    </div>
                    <span className="text-sm font-semibold text-gray-500">🕐 {event.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>👑 Lead: <span className="font-semibold text-gray-700">{event.lead}</span></span>
                    <span>👥 {event.members.length} member{event.members.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- PROJECTS PAGE ----
function ProjectsPage() {
  const statusStyle: Record<string, string> = {
    "In Progress": "bg-blue-50 text-blue-600",
    "Planning": "bg-yellow-50 text-yellow-600",
    "Completed": "bg-green-50 text-green-600",
  };
  const priorityStyle: Record<string, string> = {
    "High": "bg-red-50 text-red-500",
    "Medium": "bg-yellow-50 text-yellow-600",
    "Low": "bg-green-50 text-green-600",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
        <p className="text-sm text-gray-400">Projects you're involved in</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: myProjects.length, icon: "🗂️", color: "#6366F1", bg: "#EEF2FF" },
          { label: "Leading", value: myProjects.filter(p => p.isLead).length, icon: "👑", color: "#10B981", bg: "#D1FAE5" },
          { label: "In Progress", value: myProjects.filter(p => p.status === "In Progress").length, icon: "🔄", color: "#3B82F6", bg: "#DBEAFE" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{s.icon}</span>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {myProjects.map(project => {
          const deptColor = DEPT_COLORS[project.dept] || "#6366F1";
          return (
            <div key={project.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: deptColor + "20" }}>
                  <span className="text-lg">🗂️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-gray-800">{project.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[project.status]}`}>{project.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyle[project.priority]}`}>{project.priority}</span>
                    {project.isLead && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">You're Lead</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>👑 {project.lead}</span>
                    <span>📅 {project.deadline}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${project.progress}%`, backgroundColor: deptColor }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 w-8 text-right">{project.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- PAYSLIP PAGE ----
function PayslipPage() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Payslips</h1>
        <p className="text-sm text-gray-400">Salary history and payslip details</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Monthly Salary", value: "$4,500", icon: "💵", color: "#6366F1", bg: "#EEF2FF" },
          { label: "YTD Earnings", value: `$${payslips.reduce((s, p) => s + p.amount, 0).toLocaleString()}`, icon: "📈", color: "#10B981", bg: "#D1FAE5" },
          { label: "Payslips", value: payslips.length, icon: "📄", color: "#F59E0B", bg: "#FEF3C7" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{s.icon}</span>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Payslip History</h3>
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-gray-100">{["Month", "Amount", "Paid Date", "Status", "Action"].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-400 px-5 py-4 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>
            {payslips.map((p, i) => (
              <tr key={i} className={`hover:bg-gray-50 transition ${i !== payslips.length - 1 ? "border-b border-gray-50" : ""}`}>
                <td className="px-5 py-4 text-sm font-semibold text-gray-800">{p.month}</td>
                <td className="px-5 py-4 text-sm font-bold text-gray-800">${p.amount.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-gray-400">{p.date}</td>
                <td className="px-5 py-4"><span className="text-xs px-3 py-1 rounded-full font-medium bg-green-50 text-green-600">{p.status}</span></td>
                <td className="px-5 py-4">
                  <button onClick={() => setSelected(p)} className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payslip Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 w-[420px] shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Payslip · {selected.month}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white mb-5">
              <p className="text-indigo-200 text-xs mb-1">Net Pay</p>
              <p className="text-3xl font-bold">${selected.amount.toLocaleString()}</p>
              <p className="text-indigo-200 text-sm mt-2">{selected.month}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Employee", value: currentStaff.name },
                { label: "Role", value: currentStaff.role },
                { label: "Department", value: "Creative" },
                { label: "Basic Salary", value: `$${selected.amount.toLocaleString()}` },
                { label: "Deductions", value: "$0" },
                { label: "Net Pay", value: `$${selected.amount.toLocaleString()}` },
                { label: "Payment Date", value: selected.date },
                { label: "Status", value: selected.status },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{row.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- PROFILE PAGE ----
function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    name: currentStaff.name,
    email: currentStaff.email,
    phone: currentStaff.phone,
    location: currentStaff.location,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-sm text-gray-400">Manage your personal information</p>
      </div>
      <div className="grid grid-cols-3 gap-6 items-start">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: getAvatarColor(currentStaff.name) }}>
            {getInitials(currentStaff.name)}
          </div>
          <h2 className="font-bold text-gray-800 text-lg">{currentStaff.name}</h2>
          <p className="text-sm text-gray-400 mb-1">{currentStaff.role}</p>
          <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">Active</span>
          <div className="mt-4 pt-4 border-t border-gray-100 text-left">
            {[
              { icon: "🏢", label: "Department", value: "Creative" },
              { icon: "📅", label: "Joined", value: currentStaff.joined },
              { icon: "💰", label: "Salary", value: currentStaff.salary },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 py-2">
                <span className="text-base w-6">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit info */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800">Personal Information</h3>
            <button onClick={() => setEditing(e => !e)}
              className={`text-sm px-4 py-2 rounded-xl font-medium transition ${editing ? "bg-gray-100 text-gray-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
              {editing ? "Cancel" : "✏️ Edit"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: "Full Name", key: "name" },
              { label: "Email", key: "email" },
              { label: "Phone", key: "phone" },
              { label: "Location", key: "location" },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">{field.label}</label>
                {editing ? (
                  <input type="text" value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 text-gray-800 transition" />
                ) : (
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-2.5">{form[field.key]}</p>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <button onClick={() => setEditing(false)}
              className="mt-5 bg-indigo-600 text-white text-sm px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition">
              Save Changes
            </button>
          )}
        </div>

        {/* Team */}
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">My Team (Creative Department)</h3>
          <div className="flex gap-4 flex-wrap">
            {teamMembers.map(member => (
              <div key={member.name} className={`flex items-center gap-3 p-4 rounded-2xl border flex-1 min-w-[200px] ${member.isMe ? "border-indigo-200 bg-indigo-50" : "border-gray-100"}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: getAvatarColor(member.name) }}>
                  {getInitials(member.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{member.name} {member.isMe && <span className="text-xs text-indigo-500">(You)</span>}</p>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${member.status === "Active" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>{member.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN APP =====================
export default function StaffDashboard() {
  const [activePage, setActivePage] = useState("home");
  const [leaves, setLeaves] = useState<any[]>(myLeaveApplications);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [, setForceRender] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("currentUser");
    const role = localStorage.getItem("userRole");
    if (email) {
      currentStaff.name = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      currentStaff.email = email;
      if (role) currentStaff.role = role.charAt(0).toUpperCase() + role.slice(1);
      setForceRender(true);
    }
  }, []);

  function handleLeaveSubmit(leave: any) {
    setLeaves((prev: any[]) => [{ ...leave, id: Date.now() }, ...prev]);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("#notif-panel") && !target.closest("#notif-btn")) setShowNotif(false);
      if (!target.closest("#profile-panel") && !target.closest("#profile-btn")) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const pendingLeaveCount = leaves.filter(l => l.status === "Pending").length;

  const navItems = [
    { id: "home", icon: "⊞", label: "Home" },
    { id: "schedule", icon: "📅", label: "Schedule" },
    { id: "projects", icon: "🗂️", label: "Projects" },
    { id: "leave", icon: "🏖️", label: "My Leave" },
    { id: "payslip", icon: "💵", label: "Payslips" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  function renderPage() {
    switch (activePage) {
      case "home": return <HomePage leaves={leaves} />;
      case "schedule": return <SchedulePage />;
      case "projects": return <ProjectsPage />;
      case "leave": return <LeavePage leaves={leaves} onApply={() => setShowLeaveModal(true)} />;
      case "payslip": return <PayslipPage />;
      case "profile": return <ProfilePage />;
      default: return <HomePage leaves={leaves} />;
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className="flex flex-1 bg-gray-50 overflow-hidden w-full h-full text-gray-800">
      {showLeaveModal && <LeaveModal onClose={() => setShowLeaveModal(false)} onSubmit={handleLeaveSubmit} />}

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col py-5 px-4 shrink-0 shadow-sm overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 px-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 items-center justify-center flex">
            <span className="text-white text-xs font-bold">DV</span>
          </div>
          <span className="font-bold text-gray-800 text-base">DizVerse</span>
        </div>

        {/* Staff card in sidebar */}
        <div className="bg-indigo-50 rounded-2xl p-3 mb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: getAvatarColor(currentStaff.name) }}>
            {getInitials(currentStaff.name)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{currentStaff.name}</p>
            <p className="text-xs text-indigo-500 truncate">{currentStaff.role}</p>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Menu</p>
        <nav className="flex flex-col gap-1" style={{ position: 'static', padding: 0, background: 'none', border: 'none', zIndex: 'auto' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activePage === item.id ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
              <span className="text-base shrink-0">{item.icon}</span>
              <span className="truncate flex-1 text-left">{item.label}</span>
              {item.id === "leave" && pendingLeaveCount > 0 && (
                <span className="shrink-0 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-bold">{pendingLeaveCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <button onClick={() => setShowLeaveModal(true)}
            className="w-full bg-indigo-600 text-white text-sm py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition">
            + Apply Leave
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 relative">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 shrink-0 relative z-40 shadow-sm">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-700">{navItems.find(n => n.id === activePage)?.label || "Home"}</h2>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Notification */}
            <div className="relative">
              <button id="notif-btn" onClick={() => setShowNotif(v => !v)}
                className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {pendingLeaveCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">{pendingLeaveCount}</span>
                )}
              </button>
              {showNotif && (
                <div id="notif-panel" className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h4 className="font-bold text-gray-800 text-sm">Notifications</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {pendingLeaveCount > 0 ? (
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs font-semibold text-gray-700">⏳ Leave application pending</p>
                        <p className="text-xs text-gray-400 mt-0.5">Your leave request is awaiting HR approval</p>
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-2xl mb-2">🎉</p>
                        <p className="text-sm text-gray-400">No new notifications.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button id="profile-btn" onClick={() => setShowProfile(v => !v)}
                className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-xl transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: getAvatarColor(currentStaff.name) }}>
                  {getInitials(currentStaff.name)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{currentStaff.name}</p>
                  <p className="text-xs text-gray-400 leading-tight">{currentStaff.role}</p>
                </div>
              </button>
              {showProfile && (
                <div id="profile-panel" className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-indigo-50">
                    <p className="text-sm font-bold text-gray-800">{currentStaff.name}</p>
                    <p className="text-xs text-gray-500">{currentStaff.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => { setActivePage("profile"); setShowProfile(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition text-left text-sm text-gray-700 font-medium">
                      👤 My Profile
                    </button>
                    <button onClick={() => { setShowLeaveModal(true); setShowProfile(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition text-left text-sm text-gray-700 font-medium">
                      🏖️ Apply Leave
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto px-6 py-5 bg-gray-50 text-gray-800 relative z-10">{renderPage()}</main>
      </div>
    </div>
  );
}
