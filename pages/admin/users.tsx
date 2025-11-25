import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

interface User {
  user_id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  last_login: string;
  created_at: string;
}

export default function AdminUsers() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    {
      user_id: 1,
      name: 'John Doe',
      email: 'john@zamzamtours.com',
      role: 'admin',
      status: 'active',
      last_login: '2024-01-15 14:30',
      created_at: '2024-01-01'
    },
    {
      user_id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@zamzamtours.com',
      role: 'manager',
      status: 'active',
      last_login: '2024-01-14 09:15',
      created_at: '2024-01-05'
    },
    {
      user_id: 3,
      name: 'Mike Johnson',
      email: 'mike@zamzamtours.com',
      role: 'staff',
      status: 'active',
      last_login: '2024-01-13 16:45',
      created_at: '2024-01-10'
    },
    {
      user_id: 4,
      name: 'Emily Davis',
      email: 'emily@zamzamtours.com',
      role: 'staff',
      status: 'inactive',
      last_login: '2024-01-10 11:20',
      created_at: '2024-01-08'
    },
    {
      user_id: 5,
      name: 'Ahmed Hassan',
      email: 'ahmed@zamzamtours.com',
      role: 'manager',
      status: 'active',
      last_login: '2024-01-15 08:00',
      created_at: '2024-01-03'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff' as 'admin' | 'manager' | 'staff',
    status: 'active' as 'active' | 'inactive',
    password: ''
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'manager': return '#f59e0b';
      case 'staff': return '#0ea5e9';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string): string => {
    return status === 'active' ? '#10b981' : '#6b7280';
  };

  const getRoleIcon = (role: string): string => {
    switch (role) {
      case 'admin': return '👑';
      case 'manager': return '💼';
      case 'staff': return '👨‍💼';
      default: return '👤';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.user_id === editingUser.user_id 
          ? { ...formData, user_id: editingUser.user_id, last_login: editingUser.last_login, created_at: editingUser.created_at }
          : user
      ));
    } else {
      // Add new user
      const newUser: User = {
        ...formData,
        user_id: Math.max(...users.map(u => u.user_id)) + 1,
        last_login: 'Never',
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setFormData({ name: '', email: '', role: 'staff', status: 'active', password: '' });
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '' // Don't show existing password for security
    });
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.user_id !== userId));
    }
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.user_id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full system access' },
    { value: 'manager', label: 'Manager', description: 'Manage bookings and content' },
    { value: 'staff', label: 'Staff', description: 'Limited access' }
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <AdminSidebar active="users" />

      {/* Main Content */}
      <div style={{ marginLeft: '280px', padding: '30px' }}>
        <style jsx global>{`
          @media (max-width: 900px) {
            body > div > div:last-child {
              margin-left: 0 !important;
            }
          }
        `}</style>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>User Management</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage admin users and their permissions</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 15px 10px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  width: '300px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  const input = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
                  input.style.borderColor = '#053b3c';
                  input.style.boxShadow = '0 0 0 3px rgba(5, 59, 60, 0.1)';
                }}
                onBlur={(e) => {
                  const input = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
                  input.style.borderColor = '#e2e8f0';
                  input.style.boxShadow = 'none';
                }}
              />
              <span style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }}>🔍</span>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#053b3c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.backgroundColor = '#0a4a4b';
                btn.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.backgroundColor = '#053b3c';
                btn.style.transform = 'translateY(0)';
              }}
            >
              <span>+</span> Add New User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0ea5e9',
                fontSize: '18px'
              }}>👥</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {users.length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Total Users</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                fontSize: '18px'
              }}>👑</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {users.filter(u => u.role === 'admin').length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Admins</p>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                fontSize: '18px'
              }}>✅</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {users.filter(u => u.status === 'active').length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Active Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
            gap: '16px',
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151'
          }}>
            <div>User</div>
            <div>Email</div>
            <div>Role</div>
            <div>Status</div>
            <div>Last Login</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {filteredUsers.map((user, index) => (
            <div
              key={user.user_id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
                gap: '16px',
                padding: '20px',
                borderBottom: index < filteredUsers.length - 1 ? '1px solid #f1f5f9' : 'none',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {/* User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#053b3c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Joined {user.created_at}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ fontSize: '14px', color: '#374151' }}>
                {user.email}
              </div>

              {/* Role */}
              <div>
                <div style={{
                  backgroundColor: getRoleColor(user.role) + '15',
                  color: getRoleColor(user.role),
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  width: 'fit-content'
                }}>
                  {getRoleIcon(user.role)} {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>

              {/* Status */}
              <div>
                <button
                  onClick={() => toggleUserStatus(user.user_id)}
                  style={{
                    backgroundColor: getStatusColor(user.status) + '15',
                    color: getStatusColor(user.status),
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.opacity = '1';
                  }}
                >
                  {user.status === 'active' ? '✅ Active' : '❌ Inactive'}
                </button>
              </div>

              {/* Last Login */}
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {user.last_login}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(user)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    color: '#0ea5e9',
                    border: '1px solid #0ea5e9',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = '#0ea5e9';
                    btn.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#0ea5e9';
                  }}
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(user.user_id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = '#ef4444';
                    btn.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#ef4444';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', margin: '0 0 8px 0' }}>
              {searchTerm ? 'No users found' : 'No users yet'}
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first admin user to get started'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowModal(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#053b3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add First User
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#053b3c', margin: '0 0 20px 0' }}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              {!editingUser && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Role
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {getRoleIcon(role.value)} {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <option value="active">✅ Active</option>
                  <option value="inactive">❌ Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#053b3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}