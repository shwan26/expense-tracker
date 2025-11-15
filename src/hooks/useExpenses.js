import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

export function useExpenses(user) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setExpenses([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'users', user.uid, 'expenses'),
      orderBy('date', 'desc'),
    )

    const unsub = onSnapshot(q, snap => {
      const items = snap.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        }
      })
      setExpenses(items)
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  return { expenses, loading }
}
