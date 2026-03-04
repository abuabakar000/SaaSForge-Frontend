import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { Plus, Image as ImageIcon, Github, ExternalLink, Edit2, Trash2, Crown, Lock } from "lucide-react";
import ProjectModal from "../components/ProjectModal";

const Projects = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const isPro = auth?.roles?.includes('admin');

    useEffect(() => {
        fetchProjects();
    }, []);

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
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await axiosPrivate.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            console.error("Failed to delete", err);
            alert(err?.response?.data?.message || 'Delete failed');
        }
    };

    const handleCreateClick = () => {
        if (!isPro && projects.length >= 3) {
            alert("Free plan limited to 3 projects. Expand your portfolio with Pro!");
            return;
        }
        setEditingProject(null);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <section className="p-8 max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Projects</h1>
                    <p className="text-slate-400">Manage your SaaS portfolio and showcase your work.</p>
                </div>

                <div className="flex items-center gap-4">
                    {!isPro && (
                        <div className="text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                            <span className={projects.length >= 3 ? 'text-red-400' : 'text-emerald-400'}>{projects.length}</span> / 3 Projects
                        </div>
                    )}
                    <button
                        onClick={handleCreateClick}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${!isPro && projects.length >= 3
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                            }`}
                    >
                        {!isPro && projects.length >= 3 ? <Lock className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                        New Project
                    </button>
                </div>
            </header>

            {projects.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-3xl p-12 text-center max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ImageIcon className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                    <p className="text-slate-400 mb-6">Create your first project to start building your portfolio.</p>
                    <button
                        onClick={handleCreateClick}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project._id} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl group hover:border-slate-600 transition-colors flex flex-col">

                            {/* Image Header */}
                            <div className="h-48 bg-slate-900 relative border-b border-slate-700/50">
                                {project.images && project.images.length > 0 ? (
                                    <img
                                        src={`http://127.0.0.1:5000${project.images[0]}`}
                                        alt={project.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                                        <ImageIcon className="w-12 h-12 opacity-50" />
                                    </div>
                                )}

                                {project.isFeatured && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider rounded border border-amber-400/50 flex items-center gap-1 shadow-lg">
                                        <Crown className="w-3 h-3" /> Featured
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1" title={project.name}>
                                    {project.name}
                                </h3>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1" title={project.description}>
                                    {project.description}
                                </p>

                                {/* Links & Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        {project.githubLink ? (
                                            <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-700 rounded-lg">
                                                <Github className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            <div className="w-7"></div>
                                        )}
                                        {project.liveLink ? (
                                            <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors p-1.5 hover:bg-slate-700 rounded-lg">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            <div className="w-7"></div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <ProjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    project={editingProject}
                    onSuccess={fetchProjects}
                    isPro={isPro}
                />
            )}
        </section>
    );
};

export default Projects;
