import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNotification } from "../context/NotificationContext";
import { X, UploadCloud, Info } from "lucide-react";

const ProjectModal = ({ isOpen, onClose, project, onSuccess, isPro }) => {
    const axiosPrivate = useAxiosPrivate();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        githubLink: '',
        liveLink: '',
        isFeatured: false,
    });
    const [files, setFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                githubLink: project.githubLink || '',
                liveLink: project.liveLink || '',
                isFeatured: project.isFeatured || false,
            });
            setExistingImages(project.images || []);
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Enforce Pro limits on frontend
        if (!isPro && (existingImages.length + selectedFiles.length) > 1) {
            setError("Free plan limits you to 1 image per project.");
            e.target.value = null; // reset input
            setFiles([]);
            return;
        }

        setError('');
        setFiles(selectedFiles);
    };

    const handleRemoveExistingImage = (imgUrl) => {
        setExistingImages(prev => prev.filter(img => img !== imgUrl));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        files.forEach(file => {
            submitData.append('images', file);
        });

        // Track which old images were deleted
        if (project) {
            const removedImages = project.images.filter(img => !existingImages.includes(img));
            removedImages.forEach(img => {
                submitData.append('removeImages', img);
            });
        }

        try {
            if (project) {
                await axiosPrivate.put(`/projects/${project._id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axiosPrivate.post('/projects', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            showNotification(project ? 'Project node recalibrated successfully.' : 'New project node initialized successfully.');
            onSuccess();
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="bg-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-700 relative z-10 flex flex-col max-h-full">
                <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                    <h2 className="text-xl font-bold text-white">
                        {project ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="p-3 mb-6 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
                            <Info className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form id="projectForm" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Project Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    maxLength="50"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                                    placeholder="e.g. E-Commerce Platform"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    maxLength="500"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                                    placeholder="Describe what this project does..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">GitHub URL</label>
                                <input
                                    type="url"
                                    name="githubLink"
                                    value={formData.githubLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                                    placeholder="https://github.com/..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Live Demo URL</label>
                                <input
                                    type="url"
                                    name="liveLink"
                                    value={formData.liveLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                                    placeholder="https://yourproject.com"
                                />
                            </div>

                            {/* Image Upload Area */}
                            <div className="sm:col-span-2">
                                <label className="flex items-center justify-between text-sm font-medium mb-1.5 text-slate-300">
                                    Screenshots
                                    <span className={`text-xs ${isPro ? 'text-indigo-400' : 'text-slate-500'}`}>
                                        {isPro ? 'Pro: Unlimited' : 'Free: 1 Image max'}
                                    </span>
                                </label>

                                {/* Existing Images Preview */}
                                {existingImages.length > 0 && (
                                    <div className="flex gap-3 mb-3 overflow-x-auto pb-2">
                                        {existingImages.map((img, idx) => (
                                            <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-slate-600 group">
                                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(img)}
                                                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-900/30 hover:bg-slate-900/50 transition-colors relative">
                                    <input
                                        type="file"
                                        name="images"
                                        onChange={handleFileChange}
                                        multiple={isPro}
                                        accept="image/jpeg, image/png, image/webp"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-300">Click or drag images to upload</p>
                                    <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WEBP (Max 5MB)</p>
                                    {files.length > 0 && (
                                        <p className="text-sm text-indigo-400 font-bold mt-4">{files.length} file(s) selected</p>
                                    )}
                                </div>
                            </div>

                            {/* Pro Feature: Is Featured Container */}
                            <div className="sm:col-span-2 pt-2">
                                <label className={`flex items-center gap-3 p-4 rounded-xl border ${isPro ? 'bg-indigo-900/20 border-indigo-500/30 cursor-pointer' : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'}`}>
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        disabled={!isPro}
                                        className="w-5 h-5 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-900"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                                            Star Project
                                            {!isPro && <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] uppercase font-black text-slate-500 tracking-wider">Pro Only</span>}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">Highlight this project visually in your portfolio.</p>
                                    </div>
                                </label>
                            </div>

                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-slate-700 bg-slate-800/80 sticky bottom-0 flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="projectForm"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {project ? 'Save Changes' : 'Create Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
