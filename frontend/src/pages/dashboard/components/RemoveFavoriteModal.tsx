import { Button, Modal } from '../../../components/common'

export function RemoveFavoriteModal({
  target,
  loading,
  onClose,
  onConfirm,
}: {
  target: { id: string; name: string } | null
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal
      open={!!target}
      onClose={() => !loading && onClose()}
      title="Quitar de favoritos"
      footer={
        <>
          <Button variant="ghost" disabled={loading} onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" disabled={loading} onClick={onConfirm}>
            {loading ? 'Quitando…' : 'Sí, quitar de favoritos'}
          </Button>
        </>
      }
    >
      {target ? (
        <p className="text-left text-sm text-[var(--text)]">
          ¿Quitar a <strong className="capitalize text-[var(--text-h)]">{target.name}</strong> de tus favoritos?
        </p>
      ) : null}
    </Modal>
  )
}
