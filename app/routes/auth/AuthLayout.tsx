import { Outlet } from 'react-router';
import AuthProvider from '@/lib/auth/AuthProvider';
import { ExerciseProvider } from '@/lib/exercise/ExerciseProvider';
import { ToastContainer } from 'react-toastify';
import { ProgramProvider } from '@/lib/program/ProgramProvider';
import Footer from '@/routes/auth/Footer';
import PromptProvider from '@/lib/prompt/PromptProvider';
import { SessionProvider } from '@/lib/session/SessionProvider';

export default function AuthLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex h-full w-full flex-1 flex-col overflow-y-auto p-4 pb-[65px] md:mx-auto md:max-w-[700px]">
				<ToastContainer
					position="top-right"
					autoClose={1000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<AuthProvider>
					<SessionProvider>
						<ProgramProvider>
							<PromptProvider>
								<ExerciseProvider>
									<Outlet />
								</ExerciseProvider>
							</PromptProvider>
						</ProgramProvider>
					</SessionProvider>
				</AuthProvider>
			</main>
			<Footer />
		</div>
	);
}
