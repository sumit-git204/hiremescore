import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LogOut, Bot, GraduationCap, LayoutDashboard } from 'lucide-react';

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="glass-card rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 border-2 border-neon-green flex items-center justify-center neon-glow">
                            <Bot size={20} className="text-neon-green" />
                        </div>
                        <span className="font-bold text-xl tracking-wider text-white flex items-center gap-2">
                            HIRE ME SCORE
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                            <span className="text-neon-green flex items-center gap-2">
                                <LayoutDashboard size={16} /> Dashboard
                            </span>
                            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                                <GraduationCap size={16} /> Roadmap
                            </span>
                        </div>

                        <div className="w-px h-6 bg-gray-700 hidden md:block"></div>

                        <div className="flex items-center gap-3">
                            <img
                                src={user?.photoURL || "https://ui-avatars.com/api/?name=" + user?.email}
                                alt="Profile"
                                className="w-8 h-8 rounded-full border border-gray-600"
                            />
                            <span className="text-sm font-medium text-gray-300 hidden sm:block">
                                {user?.displayName?.split(' ')[0] || "Student"}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-neon-blue transition-colors ml-2"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
