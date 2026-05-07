import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, X, Upload, Eye, EyeOff, Users, User, ImageIcon } from 'lucide-react';
import { fetchTasks, createTask, updateTask } from '../store/slices/taskSlice.js';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge.jsx';
import projectService from '../services/projectService.js';
import taskService from '../services/taskService.js';
import { PRIORITIES, ROLES } from '../utils/constants.js';

// ─── Create Task Modal (Admin only) ────────────────────────────
function CreateTaskModal({ project, onClose }) {
  const dispatch = useDispatch();
  const [assignAll, setAssignAll]   = useState(false);
  const [clientVis, setClientVis]   = useState(true);
  const [images, setImages]         = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { priority: 'medium' },
  });

  const handleFiles = (files) => {
    const arr = Array.from(files);
    setImages((prev) => [...prev, ...arr]);
    setPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',         data.title);
      fd.append('description',   data.description || '');
      fd.append('projectId',     project._id);
      fd.append('priority',      data.priority);
      fd.append('dueDate',       data.dueDate || '');
      fd.append('estimatedTime', data.estimatedTime || 0);
      fd.append('proofRequired', data.proofRequired ? 'true' : 'false');
      fd.append('clientVisible', clientVis ? 'true' : 'false');
      fd.append('assignAll',     assignAll ? 'true' : 'false');
      if (!assignAll && data.assignedTo) fd.append('assignedTo', data.assignedTo);
      images.forEach((img) => fd.append('images', img));

      await dispatch(createTask(fd)).unwrap();
      toast.success(assignAll ? 'Tasks created for all employees' : 'Task created');
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="card w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">New Task</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="label">Task Title *</label>
            <input className="input" placeholder="Enter task title"
              {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Task details…"
              {...register('description')} />
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Priority</label>
              <select className="input" {...register('priority')}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input type="date" className="input" {...register('dueDate')} />
            </div>
          </div>

          {/* Assign toggle */}
          <div>
            <label className="label">Assign To</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setAssignAll(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors"
                style={{
                  borderColor: !assignAll ? 'var(--color-primary)' : 'var(--color-border)',
                  background:  !assignAll ? 'var(--color-primary-light)' : 'transparent',
                  color:       !assignAll ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
              >
                <User size={14} /> Specific Employee
              </button>
              <button
                type="button"
                onClick={() => setAssignAll(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors"
                style={{
                  borderColor: assignAll ? 'var(--color-primary)' : 'var(--color-border)',
                  background:  assignAll ? 'var(--color-primary-light)' : 'transparent',
                  color:       assignAll ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
              >
                <Users size={14} /> All Employees
              </button>
            </div>

            {!assignAll && (
              <select className="input" {...register('assignedTo')}>
                <option value="">Unassigned</option>
                {project.employees?.map((e) => (
                  <option key={e._id} value={e._id}>{e.name}</option>
                ))}
              </select>
            )}
            {assignAll && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                Task will be created individually for each of the {project.employees?.length || 0} employees on this project.
              </p>
            )}
          </div>

          {/* Client Visibility */}
          <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2">
              {clientVis ? <Eye size={16} style={{ color: 'var(--color-primary)' }} /> : <EyeOff size={16} style={{ color: 'var(--color-text-muted)' }} />}
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Client Visibility</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {clientVis ? 'Client can see this task' : 'Hidden from client'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setClientVis((v) => !v)}
              className="w-10 h-6 rounded-full transition-colors relative"
              style={{ background: clientVis ? 'var(--color-primary)' : 'var(--color-border)' }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: clientVis ? '20px' : '4px' }}
              />
            </button>
          </div>

          {/* Proof Required */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" {...register('proofRequired')} />
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>Require proof image from employee</span>
          </label>

          {/* Image Upload */}
          <div>
            <label className="label">Attach Images (optional)</label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            >
              <Upload size={20} className="mx-auto mb-1" style={{ color: 'var(--color-text-muted)' }} />
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Click or drag images here</p>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                onChange={(e) => handleFiles(e.target.files)} />
            </div>

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="w-16 h-16 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                      style={{ background: 'var(--color-danger)' }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Creating…' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Upload Images Modal (Employee) ───────────────────────────
function UploadImagesModal({ task, onClose, onUploaded }) {
  const [images, setImages]     = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading]   = useState(false);
  const fileRef = useRef();

  const handleFiles = (files) => {
    const arr = Array.from(files);
    setImages((prev) => [...prev, ...arr]);
    setPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (images.length === 0) return toast.error('Select at least one image');
    setLoading(true);
    try {
      const fd = new FormData();
      images.forEach((img) => fd.append('images', img));
      await taskService.uploadImages(task._id, fd);
      toast.success('Images uploaded');
      onUploaded();
      onClose();
    } catch {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Upload Proof Images</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Task: <span style={{ color: 'var(--color-text)' }}>{task.title}</span></p>

        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-3"
          style={{ borderColor: 'var(--color-border)' }}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <Upload size={24} className="mx-auto mb-2" style={{ color: 'var(--color-text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Click or drag images here</p>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />
        </div>

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {previews.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="w-16 h-16 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                  style={{ background: 'var(--color-danger)' }}>
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={handleUpload} className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Uploading…' : 'Upload'}
          </button>
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Card ─────────────────────────────────────────────────
function TaskCard({ task, userRole, onUploadImages }) {
  const dispatch = useDispatch();
  const [showImages, setShowImages] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTask({ id: task._id, payload: { status: newStatus } })).unwrap();
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const employeeStatuses = ['in_progress', 'submitted'];

  return (
    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{task.title}</p>
          {task.description && (
            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{task.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {task.assignedTo && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'var(--color-primary)' }}>
                {task.assignedTo.name?.charAt(0)}
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{task.assignedTo.name}</span>
            </div>
          )}
          {task.dueDate && (
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Image count */}
          {task.images?.length > 0 && (
            <button
              onClick={() => setShowImages((v) => !v)}
              className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--color-primary)' }}
            >
              <ImageIcon size={13} />
              {task.images.length}
            </button>
          )}

          {/* Employee: update status + upload images */}
          {userRole === ROLES.EMPLOYEE && ['todo', 'in_progress'].includes(task.status) && (
            <>
              <select
                className="text-xs border rounded px-1.5 py-1"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="todo">To Do</option>
                {employeeStatuses.map((s) => <option key={s} value={s}>{s === 'in_progress' ? 'In Progress' : 'Submit'}</option>)}
              </select>
              <button
                onClick={() => onUploadImages(task)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              >
                <Upload size={12} /> Upload
              </button>
            </>
          )}

          {/* Admin: approve/reject */}
          {userRole === ROLES.ADMIN && task.status === 'submitted' && (
            <div className="flex gap-1.5">
              <button
                onClick={() => handleStatusChange('approved')}
                className="text-xs px-2 py-1 rounded"
                style={{ background: '#dcfce7', color: '#15803d' }}
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                className="text-xs px-2 py-1 rounded"
                style={{ background: '#fee2e2', color: '#b91c1c' }}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image thumbnails */}
      {showImages && task.images?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {task.images.map((img, i) => (
            <a key={i} href={img.url} target="_blank" rel="noreferrer">
              <img src={img.url} className="w-14 h-14 object-cover rounded-lg hover:opacity-80 transition-opacity" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function ProjectDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);
  const [project, setProject]         = useState(null);
  const [showCreateModal, setShowCreate] = useState(false);
  const [uploadTarget, setUploadTarget]  = useState(null); // task to upload images for

  const loadProject = () =>
    projectService.getById(id).then(({ data }) => setProject(data.data));

  const loadTasks = () => dispatch(fetchTasks({ projectId: id }));

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [id]);

  if (!project) return <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">{project.name}</h1>
          {project.description && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={project.priority} />
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Team */}
      <div className="card p-5">
        <h2 className="section-title mb-3">Team Members</h2>
        <div className="flex flex-wrap gap-2">
          {project.employees?.map((emp) => (
            <div key={emp._id} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--color-primary)', color: '#fff' }}>
                {emp.name.charAt(0)}
              </div>
              {emp.name}
            </div>
          ))}
          {(!project.employees || project.employees.length === 0) && (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No employees assigned</p>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Tasks <span className="text-sm font-normal" style={{ color: 'var(--color-text-muted)' }}>({tasks.length})</span></h2>
          {user?.role === ROLES.ADMIN && (
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={15} /> Add Task
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading tasks…</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                userRole={user?.role}
                onUploadImages={setUploadTarget}
              />
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: 'var(--color-text-muted)' }}>No tasks yet</p>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateTaskModal
          project={project}
          onClose={() => { setShowCreate(false); loadTasks(); }}
        />
      )}
      {uploadTarget && (
        <UploadImagesModal
          task={uploadTarget}
          onClose={() => setUploadTarget(null)}
          onUploaded={loadTasks}
        />
      )}
    </div>
  );
}
