import React from 'react';
import { useForm, Controller } from 'react-hook-form';

interface CalendarNoteFormProps {
  onSubmit: (data: any) => void;
}

const CalendarNoteForm: React.FC<CalendarNoteFormProps> = ({ onSubmit }) => {
  // Menggunakan useForm untuk mengelola form dengan default values
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: '', // Default value untuk deskripsi
      startTime: '', // Default value untuk waktu mulai
      endTime: '', // Default value untuk waktu selesai
      note: '', // Default value untuk catatan tambahan
    },
  });

  return (
    <div style={styles.container}>
      {/* Input untuk deskripsi */}
      <label style={styles.label}>Deskripsi</label>
      <Controller
        control={control}
        name="description"
        rules={{ required: 'Deskripsi wajib diisi' }}
        render={({ field: { onChange, value } }) => (
          <input style={styles.input} onChange={onChange} value={value} />
        )}
      />
      {errors.description && (
        <span style={styles.error}>{errors.description.message}</span>
      )}

      {/* Input untuk catatan */}
      <label style={styles.label}>Catatan</label>
      <Controller
        control={control}
        name="note"
        rules={{ required: 'Catatan wajib diisi' }}
        render={({ field: { onChange, value } }) => (
          <input style={styles.input} onChange={onChange} value={value} />
        )}
      />
      {errors.note && <span style={styles.error}>{errors.note.message}</span>}

      {/* Input untuk waktu mulai dengan format ISO 8601 */}
      <label style={styles.label}>Waktu Mulai</label>
      <Controller
        control={control}
        name="startTime"
        rules={{ required: 'Waktu mulai wajib diisi' }}
        render={({ field: { onChange, value } }) => (
          <input
            type="datetime-local"
            style={styles.input}
            onChange={onChange}
            value={value}
          />
        )}
      />
      {errors.startTime && (
        <span style={styles.error}>{errors.startTime.message}</span>
      )}

      {/* Input untuk waktu selesai dengan format ISO 8601 */}
      <label style={styles.label}>Waktu Selesai</label>
      <Controller
        control={control}
        name="endTime"
        rules={{ required: 'Waktu selesai wajib diisi' }}
        render={({ field: { onChange, value } }) => (
          <input
            type="datetime-local"
            style={styles.input}
            onChange={onChange}
            value={value}
          />
        )}
      />
      {errors.endTime && (
        <span style={styles.error}>{errors.endTime.message}</span>
      )}

      {/* Tombol untuk mengirim form */}
      <button style={styles.button} onClick={handleSubmit(onSubmit)}>
        Simpan
      </button>
    </div>
  );
};

import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '16px',
    backgroundColor: '#fff', // Warna latar belakang putih
    maxWidth: '400px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  input: {
    border: '1px solid #ccc', // Warna border abu-abu
    padding: '8px',
    borderRadius: '5px', // Membuat border sedikit membulat
    width: '100%',
  },
  error: {
    color: 'red', // Menampilkan pesan error dengan warna merah
    fontSize: '12px',
  },
  button: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default CalendarNoteForm;
