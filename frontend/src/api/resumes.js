import axios from "axios"

const BASE = "http://localhost:8000/resumes"

export async function uploadResume(file) {
    const formData = new FormData()
    formData.append("file", file)
    const res = await axios.post(`${BASE}/upload`, formData)
    return res.data
}

export async function listResumes() {
    const res = await axios.get(`${BASE}/`)
    return res.data
}

export async function deleteResume(filename) {
    const res = await axios.delete(`${BASE}/${filename}`)
    return res.data
}