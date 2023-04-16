// Copyright 2023 David Li

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { sql } from '@databases/sqlite-sync'
import { type NextApiRequest, type NextApiResponse } from 'next'

import db from '@/db'

interface Alum {
  name: string
  user_id?: number
}

type Result = Record<number, Alum[]>

export default function handler (
  req: NextApiRequest,
  res: NextApiResponse<Result>
): void {
  const beginYear = req.query.beginYear ?? Number.MIN_SAFE_INTEGER
  const endYear = req.query.endYear ?? Number.MAX_SAFE_INTEGER

  const result: Result = {}
  db.query(sql`
    SELECT name, grad_year, user_id FROM people
    WHERE grad_year BETWEEN ${beginYear} AND ${endYear}
    ORDER BY name
  `).forEach((alum) => {
    result[alum.grad_year] ||= []
    result[alum.grad_year].push({
      name: alum.name,
      user_id: alum.user_id ?? undefined
    })
  })
  res.json(result)
}
