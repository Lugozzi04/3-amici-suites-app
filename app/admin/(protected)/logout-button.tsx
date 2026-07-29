"use client";

export function AdminLogoutButton() {
  async function handleLogout() {
    await fetch("/3-amici-suites/api/admin/logout/", { method: "POST" });
    window.location.href = "/3-amici-suites/admin/login/";
  }

  return (
    <button onClick={handleLogout} className="text-sm text-[#9b463d] hover:text-red-700">
      Esci
    </button>
  );
}
