import { Search } from 'lucide-react'
import { styles } from '../../../constants/styles'
import { Button, FormField, TextInput } from '../../../components/common'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  typeFilter: string
  onTypeFilterChange: (v: string) => void
  onApplyTypeFilter: () => void
}

export function FavoritesFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onApplyTypeFilter,
}: Props) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-end ${styles.card} p-4`}
    >
      <FormField id="dash-search" label="Buscar por nombre" className="flex-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text)]/50" />
          <TextInput
            id="dash-search"
            className="pl-10"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="pikachu…"
          />
        </div>
      </FormField>
      <FormField id="dash-type" label="Tipo" className="w-full sm:w-40">
        <TextInput
          id="dash-type"
          value={typeFilter}
          onChange={(e) =>
            onTypeFilterChange(e.target.value.toLowerCase().replace(/\s/g, ''))
          }
          placeholder="electric"
        />
      </FormField>
      <Button variant="ghost" type="button" onClick={onApplyTypeFilter}>
        Filtrar tipo
      </Button>
    </div>
  )
}
