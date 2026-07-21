'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'

export default function ColdStartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.data?.id

  const [tags, setTags] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const TAG_API_URL = 'http://localhost:8000/api/tag'
  const COLDSTART_API_URL = 'http://localhost:8000/api/coldstart'
  const REC_API_URL = 'http://localhost:8000/api/recommendations/user'

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${TAG_API_URL}/all`)
        setTags(response.data.data || [])
      } catch (err) {
        setError('Failed to load interests. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  useEffect(() => {
    const fetchSavedPreferences = async () => {
      if (!userId) return

      try {
        const response = await axios.get(`${COLDSTART_API_URL}/${userId}`)
        const savedTagIds = response.data.data?.map((item) =>
          item.tag_id || item.tagId || item.id
        ) || []

        setSelectedTagIds(savedTagIds)
      } catch (err) {
        // Safe to ignore if no preferences exist yet
      }
    }

    fetchSavedPreferences()
  }, [userId])

  const toggleTag = (tagId) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (selectedTagIds.length === 0) {
      setError('Please select at least one interest.')
      return
    }

    try {
      setSaving(true)

      await axios.post(`${COLDSTART_API_URL}/save`, {
        userId,
        tagIds: selectedTagIds,
      })

      await axios.get(`${REC_API_URL}/${userId}/content-based?k=5`)
      router.push('/homepage')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Welcome
            </p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-4xl">
              Pick a few interests to personalize your feed
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Choose the tags that match what you like. We’ll use them to build your first recommendations.
            </p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-16 text-center text-gray-600">Loading interests...</div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {tags.map((tag) => {
                    const tagId = tag.tag_id || tag.tagId || tag.id
                    const label = tag.name || tag.tag_name || tag.label

                    const selected = selectedTagIds.includes(tagId)

                    return (
                      <button
                        key={tagId}
                        type="button"
                        onClick={() => toggleTag(tagId)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                          selected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="mb-3 text-sm font-semibold text-gray-700">
                    Selected preferences
                  </div>
                  {selectedTagIds.length === 0 ? (
                    <p className="text-sm text-gray-500">No interests selected yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags
                        .filter((tag) =>
                          selectedTagIds.includes(tag.tag_id || tag.tagId || tag.id)
                        )
                        .map((tag) => (
                          <span
                            key={tag.tag_id || tag.tagId || tag.id}
                            className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white"
                          >
                            {tag.name || tag.tag_name || tag.label}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving || selectedTagIds.length === 0}
                  className="w-full rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {saving ? 'Saving preferences...' : 'Save Preferences'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  )
}