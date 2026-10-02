import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/notes";

function App() {
	const [notes, setNotes] = useState([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	// 1. Sayfa yüklendiğinde notları getir (GET)
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

	// 2. Yeni not ekle (POST)
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;

		try {
			await axios.post(API_URL, { title, content });
			setTitle("");
			setContent("");
			fetchNotes(); // Listeyi güncelle
		} catch (error) {
			console.error("Not eklenirken hata oluştu:", error);
		}
	};

	// 3. Not sil (DELETE)
	const handleDelete = async (id) => {
		try {
			await axios.delete(`${API_URL}/${id}`);
			fetchNotes(); // Listeyi güncelle
		} catch (error) {
			console.error("Not silinirken hata oluştu:", error);
		}
	};

	return (
		<div
			style={{
				maxWidth: "600px",
				margin: "40px auto",
				fontFamily: "sans-serif",
				padding: "0 20px",
			}}
		>
			<h1>📝 Not Defteri Uygulaması</h1>

			{/* Not Ekleme Formu */}
			<form
				onSubmit={handleSubmit}
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					marginBottom: "30px",
				}}
			>
				<input
					type="text"
					placeholder="Not Başlığı..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					style={{
						padding: "10px",
						fontSize: "16px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
				/>
				<textarea
					placeholder="Not içeriğini buraya yazın..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows="3"
					style={{
						padding: "10px",
						fontSize: "16px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
				/>
				<button
					type="submit"
					style={{
						padding: "10px",
						fontSize: "16px",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					Not Ekle
				</button>
			</form>

			<hr style={{ border: "0.5px solid #eee", marginBottom: "20px" }} />

			{/* Notların Listelenmesi */}
			<h2>Notlarım</h2>
			{notes.length === 0 ? (
				<p style={{ color: "#666" }}>Henüz hiç not eklenmemiş.</p>
			) : (
				<div
					style={{ display: "flex", flexDirection: "column", gap: "15px" }}
				>
					{notes.map((note) => (
						<div
							key={note.id}
							style={{
								padding: "15px",
								border: "1px solid #ddd",
								borderRadius: "6px",
								backgroundColor: "#f9f9f9",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start",
							}}
						>
							<div>
								<h3 style={{ margin: "0 0 8px 0", color: "#333" }}>
									{note.title}
								</h3>
								<p
									style={{
										margin: "0",
										color: "#555",
										whiteSpace: "pre-wrap",
									}}
								>
									{note.content}
								</p>
							</div>
							<button
								onClick={() => handleDelete(note.id)}
								style={{
									backgroundColor: "#dc3545",
									color: "white",
									border: "none",
									padding: "6px 10px",
									borderRadius: "4px",
									cursor: "pointer",
									fontSize: "14px",
								}}
							>
								Sil
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default App;
