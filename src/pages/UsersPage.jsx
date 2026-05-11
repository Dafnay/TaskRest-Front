import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, getUserById, editUser, deleteUser, promoteUser, demoteUser } from "../api/userService";
import { useConfirm } from "../hooks/useConfirm";
import UserFormModal from "../components/UserFormModal";

const roleBadge = (role) => {
  const map = { ADMIN: "danger", GESTOR: "warning", USER: "secondary" };
  return <span className={`badge bg-${map[role] ?? "secondary"}`}>{role}</span>;
};

export default function UsersPage() {
  const { getAuthHeader, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const { confirm, modal: confirmModal } = useConfirm();

  const openEdit = async (id) => {
    const user = await getUserById(getAuthHeader(), id)
    setEditingUser(user)
  }

  useEffect(() => {
    getUsers(getAuthHeader())
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = async (form) => {
    const updated = await editUser(getAuthHeader(), editingUser.id, form);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar usuario",
      message: "¿Eliminar este usuario?",
      confirmLabel: "Eliminar",
    });
    if (!ok) return;
    try {
      await deleteUser(getAuthHeader(), id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const handlePromote = async (id) => {
    const updated = await promoteUser(getAuthHeader(), id);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleDemote = async (id) => {
    const updated = await demoteUser(getAuthHeader(), id);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4 fs-4">Gestión de usuarios</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th className="d-none d-md-table-cell">Usuario</th>
              <th className="d-none d-md-table-cell">Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullname}</td>
                <td className="d-none d-md-table-cell">{u.username}</td>
                <td className="d-none d-md-table-cell">{u.email}</td>
                <td>{roleBadge(u.role)}</td>
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    {u.id !== currentUser.id && (
                      <>
                        {u.role === "USER" && (
                          <button
                            className="btn btn-sm btn-outline-purple"
                            onClick={() => handlePromote(u.id)}
                            title="Promover"
                          >
                            <i className="bi bi-arrow-up-circle" />
                            <span className="d-none d-md-inline ms-1">
                              Promover
                            </span>
                          </button>
                        )}
                        {u.role === "GESTOR" && (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleDemote(u.id)}
                            title="Degradar"
                          >
                            <i className="bi bi-arrow-down-circle" />
                            <span className="d-none d-md-inline ms-1">
                              Degradar
                            </span>
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => openEdit(u.id)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil" />
                          <span className="d-none d-md-inline ms-1">
                            Editar
                          </span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(u.id)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash" />
                          <span className="d-none d-md-inline ms-1">
                            Eliminar
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormModal
        show={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleEdit}
        user={editingUser}
      />
      {confirmModal}
    </div>
  );
}
