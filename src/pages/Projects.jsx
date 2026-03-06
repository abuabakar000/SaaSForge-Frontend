import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { Plus, Github, ExternalLink, Edit3, Trash2, Package, Layers, Lock } from "lucide-react";
import ProjectModal from "../components/ProjectModal";

const Projects = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const isPro = auth?.roles?.includes('admin');

    useEffect(() => {
        fetchProjects();
    }, []);

    // Handle auto-edit from Dashboard
    useEffect(() => {
        if (!loading && projects.length > 0 && location.state?.editProjectId) {
            const projectToEdit = projects.find(p => p._id === location.state.editProjectId);
            if (projectToEdit) {
                setEditingProject(projectToEdit);
                setIsModalOpen(true);
                // Clear state so it doesn't reopen on refresh/navigation back
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [loading, projects, location.state, navigate, location.pathname]);

    const fetchProjects = async () => {
        try {
            const response = await axiosPrivate.get('/projects');
            setProjects(response.data);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Confirm the permanent deletion of this project node?')) return;

        try {
            await axiosPrivate.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            console.error("Failed to delete", err);
            alert(err?.response?.data?.message || 'Deletion sequence failed.');
        }
    };

    const handleCreateClick = () => {
        if (!isPro && projects.length >= 3) {
            alert("Free plan limited to 3 project nodes. Expand your system with Pro.");
            return;
        }
        setEditingProject(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">
                        Projects<span className="text-indigo-500">.</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <p className="text-slate-500 font-medium">Manage and monitor your specialized development nodes.</p>
                        {!isPro && (
                            <div className="text-[10px] font-black text-slate-500 bg-slate-900 border border-white/5 px-2 py-0.5 rounded uppercase tracking-widest hidden sm:block">
                                Quota: <span className={projects.length >= 3 ? 'text-red-400' : 'text-emerald-400'}>{projects.length}</span> / 3
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleCreateClick}
                    className={`px-6 py-3 font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-2 group ${!isPro && projects.length >= 3
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'}`}
                >
                    {!isPro && projects.length >= 3 ? <Lock className="w-5 h-5" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />}
                    New Discovery
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-80 bg-slate-900/40 rounded-[2rem] border border-white/5 animate-pulse"></div>
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 premium-shadow"
                        >
                            {/* Project Header/Image */}
                            <div className="h-48 bg-slate-950/50 relative overflow-hidden">
                                {project.images && project.images.length > 0 ? (
                                    <img
                                        src={project.images[0]}
                                        alt={project.name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-800">
                                        <Layers className="w-16 h-16 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>

                                {/* Badge */}
                                <div className="absolute top-4 right-4 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Node Verified</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 font-medium mb-6 leading-relaxed">
                                    {project.description || 'No specialized description provided for this development node.'}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 cursor-default" title="Deployment Status">OK</div>
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                        {project.liveLink && (
                                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={() => {
                                                setEditingProject(project);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all"
                                            title="Edit Node"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="p-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500/60 hover:text-red-400 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                                            title="Nullify Node"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center bg-slate-900/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-white/5">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 border border-white/5 mb-8 shadow-2xl">
                        <Package className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-white italic mb-2 tracking-tight">System Library Empty</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">No specialized project nodes have been initialized yet. Start your first discovery below.</p>
                    <button
                        onClick={handleCreateClick}
                        className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        Initialize First Node
                    </button>
                </div>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchProjects}
                project={editingProject}
                isPro={isPro}
            />
        </div>
    );
};

export default Projects;
