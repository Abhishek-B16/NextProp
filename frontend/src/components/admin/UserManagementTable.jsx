import React, { useState } from 'react';
import { Search, ShieldCheck, Trash2, CheckCircle2, XCircle, Filter, User as UserIcon, Loader2 } from 'lucide-react';

export default function UserManagementTable({
  users = [],
  loading = false,
  onVerifyToggle,
  onDeleteUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [verifyFilter, setVerifyFilter] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesVerify =
      verifyFilter === 'verified'
        ? u.isVerifiedOwner === true
        : verifyFilter === 'unverified'
        ? u.isVerifiedOwner === false
        : true;

    return matchesSearch && matchesRole && matchesVerify;
  });

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 space-y-4 p-5">
      {/* Top Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500/80"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none cursor-pointer"
        >
          <option value="">All Account Roles</option>
          <option value="customer">Customer</option>
          <option value="owner">Property Owner</option>
          <option value="admin">Administrator</option>
        </select>

        {/* Verification Filter */}
        <select
          value={verifyFilter}
          onChange={(e) => setVerifyFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none cursor-pointer"
        >
          <option value="">All Verification Statuses</option>
          <option value="verified">Verified Owners Only</option>
          <option value="unverified">Unverified Owners Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">User Profile</th>
              <th className="px-5 py-3.5">Email / Contact</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Verification</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">Loading platform users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">No users match criteria</td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Name & Avatar */}
                  <td className="px-5 py-4 font-semibold text-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.isVerifiedOwner && (
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" title="Verified Owner" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">ID: {u._id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="px-5 py-4">
                    <div className="text-slate-200">{u.email}</div>
                    {u.phone && <div className="text-[10px] text-slate-400">{u.phone}</div>}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : u.role === 'owner'
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* Verification Status */}
                  <td className="px-5 py-4">
                    {u.role === 'owner' ? (
                      <button
                        type="button"
                        onClick={() => onVerifyToggle(u._id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                          u.isVerifiedOwner
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white'
                        }`}
                        title="Click to toggle verification status"
                      >
                        {u.isVerifiedOwner ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Verify Owner</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">N/A</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => onDeleteUser(u._id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
