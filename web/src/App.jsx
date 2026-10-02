import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/notes";

function App() {
	const [notes, setNotes] = useState([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const fetchNotes = async () => {
		try {
			const response = await axios.get(API_URL);
			setNotes(response.data);
		} catch (error) {
			console.error("Notlar getirilirken hata oluştu:", error);
		}
	};

	useEffect(() => {
		fetchNotes();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;

		setLoading(true);
		try {
			await axios.post(API_URL, { title, content });
			setTitle("");
			setContent("");
			fetchNotes();
		} catch (error) {
			console.error("Not eklenirken hata oluştu:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`${API_URL}/${id}`);
			fetchNotes();
		} catch (error) {
			console.error("Not silinirken hata oluştu:", error);
		}
	};

	return (
		<div style={styles.layout}>
			<header style={styles.header}>
				<div style={styles.headerContent}>
					<h1 style={styles.brandTitle}>Notes Dashboard</h1>
					<span style={styles.envBadge}>Production</span>
				</div>
				<p style={styles.brandSubtitle}>
					Spring Boot & React Enterprise Workspace
				</p>
			</header>

			<main style={styles.mainContainer}>
				{/* Form Section */}
				<section style={styles.panel}>
					<h2 style={styles.panelTitle}>Create New Note</h2>
					<form onSubmit={handleSubmit} style={styles.form}>
						<div style={styles.inputGroup}>
							<label style={styles.label}>Title</label>
							<input
								type="text"
								placeholder="Enter note title..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								style={styles.input}
							/>
						</div>
						<div style={styles.inputGroup}>
							<label style={styles.label}>Content</label>
							<textarea
								placeholder="Write your note content here..."
								value={content}
								onChange={(e) => setContent(e.target.value)}
								rows={4}
								style={styles.textarea}
							/>
						</div>
						<button
							type="submit"
							style={{
								...styles.primaryButton,
								opacity: loading ? 0.6 : 1,
								cursor: loading ? "not-allowed" : "pointer",
							}}
							disabled={loading}
						>
							{loading ? "Processing..." : "Save Note"}
						</button>
					</form>
				</section>

				{/* Notes List Section */}
				<section style={styles.panel}>
					<div style={styles.panelHeader}>
						<h2 style={styles.panelTitle}>Recorded Notes</h2>
						<span style={styles.counter}>{notes.length} Entries</span>
					</div>

					{notes.length === 0 ? (
						<div style={styles.emptyState}>
							<p style={styles.emptyText}>
								No records found in the database.
							</p>
						</div>
					) : (
						<div style={styles.notesList}>
							{notes.map((note) => (
								<article key={note.id} style={styles.noteCard}>
									<div style={styles.noteBody}>
										<h3 style={styles.noteTitle}>{note.title}</h3>
										<p style={styles.noteContent}>{note.content}</p>
									</div>
									<button
										onClick={() => handleDelete(note.id)}
										style={styles.deleteButton}
									>
										Delete
									</button>
								</article>
							))}
						</div>
					)}
				</section>
			</main>
		</div>
	);
}

// Kurumsal ve Minimalist Stil Tanımlamaları
const styles = {
	layout: {
		maxWidth: "900px",
		margin: "0 auto",
		padding: "40px 24px",
		fontFamily:
			'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		backgroundColor: "#0f172a",
		minHeight: "100vh",
		color: "#f8fafc",
	},
	header: {
		marginBottom: "32px",
		borderBottom: "1px solid #1e293b",
		paddingBottom: "20px",
	},
	headerContent: {
		display: "flex",
		alignItems: "center",
		gap: "12px",
	},
	brandTitle: {
		fontSize: "1.5rem",
		fontWeight: "600",
		letterSpacing: "-0.025em",
		color: "#ffffff",
		margin: "0",
	},
	envBadge: {
		fontSize: "0.75rem",
		fontWeight: "500",
		backgroundColor: "#1e293b",
		color: "#38bdf8",
		padding: "2px 8px",
		borderRadius: "4px",
		border: "1px solid #334155",
	},
	brandSubtitle: {
		fontSize: "0.875rem",
		color: "#94a3b8",
		margin: "4px 0 0 0",
	},
	mainContainer: {
		display: "grid",
		gap: "24px",
	},
	panel: {
		backgroundColor: "#1e293b",
		borderRadius: "8px",
		border: "1px solid #334155",
		padding: "24px",
	},
	panelTitle: {
		fontSize: "1rem",
		fontWeight: "600",
		color: "#f1f5f9",
		margin: "0 0 16px 0",
	},
	panelHeader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "16px",
		borderBottom: "1px solid #334155",
		paddingBottom: "12px",
	},
	counter: {
		fontSize: "0.8125rem",
		color: "#94a3b8",
		fontWeight: "500",
	},
	form: {
		display: "flex",
		flexDirection: "column",
		gap: "16px",
	},
	inputGroup: {
		display: "flex",
		flexDirection: "column",
		gap: "6px",
	},
	label: {
		fontSize: "0.8125rem",
		fontWeight: "500",
		color: "#cbd5e1",
	},
	input: {
		backgroundColor: "#0f172a",
		border: "1px solid #475569",
		borderRadius: "6px",
		padding: "10px 12px",
		color: "#ffffff",
		fontSize: "0.875rem",
		outline: "none",
	},
	textarea: {
		backgroundColor: "#0f172a",
		border: "1px solid #475569",
		borderRadius: "6px",
		padding: "10px 12px",
		color: "#ffffff",
		fontSize: "0.875rem",
		outline: "none",
		resize: "vertical",
		fontFamily: "inherit",
	},
	primaryButton: {
		backgroundColor: "#ffffff",
		color: "#0f172a",
		border: "none",
		borderRadius: "6px",
		padding: "10px 16px",
		fontSize: "0.875rem",
		fontWeight: "600",
		cursor: "pointer",
		transition: "background-color 0.15s ease",
	},
	emptyState: {
		padding: "32px",
		textAlign: "center",
		backgroundColor: "#0f172a",
		borderRadius: "6px",
		border: "1px dashed #334155",
	},
	emptyText: {
		fontSize: "0.875rem",
		color: "#64748b",
		margin: "0",
	},
	notesList: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	noteCard: {
		backgroundColor: "#0f172a",
		border: "1px solid #334155",
		borderRadius: "6px",
		padding: "16px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	noteBody: {
		flex: 1,
		paddingRight: "16px",
	},
	noteTitle: {
		fontSize: "0.9375rem",
		fontWeight: "600",
		color: "#f8fafc",
		margin: "0 0 6px 0",
	},
	noteContent: {
		fontSize: "0.875rem",
		color: "#94a3b8",
		margin: "0",
		lineHeight: "1.5",
		wordBreak: "break-word",
	},
	deleteButton: {
		backgroundColor: "transparent",
		color: "#f87171",
		border: "1px solid #7f1d1d",
		borderRadius: "6px",
		padding: "6px 12px",
		fontSize: "0.75rem",
		fontWeight: "600",
		cursor: "pointer",
		transition: "background-color 0.15s ease",
	},
};

export default App;
