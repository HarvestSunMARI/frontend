<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">AI Assistant</h1>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div id="chatBox" class="h-[500px] overflow-y-auto mb-4 space-y-4">
          <!-- Chat messages will appear here -->
        </div>

        <div class="suggestions flex flex-wrap gap-2 mb-4">
          <!-- Quick suggestions will appear here -->
        </div>

        <form id="chatForm" class="flex gap-2">
          <input
            type="text"
            id="userInput"
            placeholder="Ketik pertanyaan Anda tentang pertanian..."
            class="input-primary flex-1"
          />
          <button type="submit" class="btn-primary">
            <PaperAirplaneIcon class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { onMounted } from 'vue'
import axios from 'axios'

onMounted(() => {
  const form = document.getElementById("chatForm") as HTMLFormElement
  const input = document.getElementById("userInput") as HTMLInputElement
  const box = document.getElementById("chatBox") as HTMLDivElement

  const suggestionsList = [
    "Apa tanaman terbaik untuk musim hujan?",
    "Bagaimana cara mengatasi hama pada padi?",
    "Kapan waktu panen terbaik untuk tomat?",
    "Apa pupuk organik yang disarankan?",
    "Bagaimana sistem irigasi tetes bekerja?",
    "Cuaca minggu ini cocok untuk menanam apa?",
    "Bagaimana mendeteksi penyakit pada daun?",
    "Apa strategi pemasaran hasil panen?",
    "Bagaimana membuat kompos alami sendiri?"
  ]

  function showRandomSuggestions() {
    const shuffled = suggestionsList.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)
    const suggestionsDiv = document.querySelector(".suggestions")
    if (suggestionsDiv) {
      suggestionsDiv.innerHTML = "<p class='w-full text-sm text-gray-600 mb-2'>Pertanyaan cepat:</p>"
      selected.forEach((q) => {
        const btn = document.createElement("button")
        btn.textContent = q
        btn.type = "button"
        btn.className = "btn-outline text-sm"
        btn.onclick = () => sendSuggestion(q)
        suggestionsDiv.appendChild(btn)
      })
    }
  }

  function sendSuggestion(question: string) {
    if (input) {
      input.value = question
      form?.dispatchEvent(new Event("submit"))
    }
  }

  function addMessage(role: string, text: string) {
    const msg = document.createElement("div")
    msg.className = `p-4 rounded-lg ${
      role === "user" 
        ? "bg-primary-50 ml-12" 
        : "bg-gray-50 mr-12"
    }`
    
    const content = document.createElement("div")
    content.className = "text-sm text-gray-900 whitespace-pre-wrap"
    content.textContent = text
    msg.appendChild(content)
    
    if (box) {
      box.appendChild(msg)
      box.scrollTop = box.scrollHeight
    }
  }

  form?.addEventListener("submit", async function (e) {
    e.preventDefault()
    const question = input?.value.trim()
    if (!question) return

    addMessage("user", question)
    if (input) input.value = ""

    try {
      const response = await axios.post('http://localhost:8000/api/ai-assistant/chat', {
        message: question
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      })

      const reply = response.data.data.choices?.[0]?.message?.content || "Tidak ada respons dari AI."
      addMessage("ai", reply)
      showRandomSuggestions()
    } catch (err) {
      console.error(err)
      addMessage("ai", "Terjadi kesalahan saat mengambil respons dari AI.")
      showRandomSuggestions()
    }
  })

  showRandomSuggestions()
})
</script>

<style scoped>
#chatBox::-webkit-scrollbar {
  width: 6px;
}

#chatBox::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

#chatBox::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

#chatBox::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 