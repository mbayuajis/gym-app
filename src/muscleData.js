const FRONT_MUSCLE_DEFS = [
  { id: 'pectoralis_major_l', label: 'Dada Kiri', group: 'Dada', view: 'front' },
  { id: 'pectoralis_major_upper_l', label: 'Dada Atas Kiri', group: 'Dada', view: 'front' },
  { id: 'pectoralis_major_lower_l', label: 'Dada Bawah Kiri', group: 'Dada', view: 'front' },
  { id: 'pectoralis_major_r', label: 'Dada Kanan', group: 'Dada', view: 'front' },
  { id: 'pectoralis_major_upper_r', label: 'Dada Atas Kanan', group: 'Dada', view: 'front' },
  { id: 'pectoralis_major_lower_r', label: 'Dada Bawah Kanan', group: 'Dada', view: 'front' },
  { id: 'anterior_deltoid_l', label: 'Deltoid Depan Kiri', group: 'Bahu', view: 'front' },
  { id: 'anterior_deltoid_r', label: 'Deltoid Depan Kanan', group: 'Bahu', view: 'front' },
  { id: 'lateral_deltoid_l', label: 'Deltoid Samping Kiri', group: 'Bahu', view: 'both' },
  { id: 'lateral_deltoid_r', label: 'Deltoid Samping Kanan', group: 'Bahu', view: 'both' },
  { id: 'trapezius_upper_l', label: 'Trap Atas Kiri', group: 'Punggung', view: 'both' },
  { id: 'trapezius_upper_r', label: 'Trap Atas Kanan', group: 'Punggung', view: 'both' },
  { id: 'latissimus_dorsi_l', label: 'Punggung Lebar Kiri', group: 'Punggung', view: 'both' },
  { id: 'latissimus_dorsi_r', label: 'Punggung Lebar Kanan', group: 'Punggung', view: 'both' },
  { id: 'biceps_brachii_caput_longum_l', label: 'Biceps Panjang Kiri', group: 'Biceps', view: 'front' },
  { id: 'biceps_brachii_caput_longum_r', label: 'Biceps Panjang Kanan', group: 'Biceps', view: 'front' },
  { id: 'biceps_brachii_caput_breve_l', label: 'Biceps Pendek Kiri', group: 'Biceps', view: 'front' },
  { id: 'biceps_brachii_caput_breve_r', label: 'Biceps Pendek Kanan', group: 'Biceps', view: 'front' },
  { id: 'triceps_brachii_caput_longum_l', label: 'Triceps Panjang Kiri', group: 'Triceps', view: 'both' },
  { id: 'triceps_brachii_caput_longum_r', label: 'Triceps Panjang Kanan', group: 'Triceps', view: 'both' },
  { id: 'triceps_brachii_caput_laterale_l', label: 'Triceps Lateral Kiri', group: 'Triceps', view: 'both' },
  { id: 'triceps_brachii_caput_laterale_r', label: 'Triceps Lateral Kanan', group: 'Triceps', view: 'both' },
  { id: 'brachioradialis_l', label: 'Brachioradialis Kiri', group: 'Lengan Bawah', view: 'front' },
  { id: 'brachioradialis_r', label: 'Brachioradialis Kanan', group: 'Lengan Bawah', view: 'front' },
  { id: 'flexor_carpi_radialis_l', label: 'Flexor Carpi Kiri', group: 'Lengan Bawah', view: 'front' },
  { id: 'flexor_carpi_radialis_r', label: 'Flexor Carpi Kanan', group: 'Lengan Bawah', view: 'front' },
  { id: 'palmaris_longus_l', label: 'Palmaris Kiri', group: 'Lengan Bawah', view: 'front' },
  { id: 'palmaris_longus_r', label: 'Palmaris Kanan', group: 'Lengan Bawah', view: 'front' },
  { id: 'extensor_carpi_radialis_longus_l', label: 'Ekstensor Kiri', group: 'Lengan Bawah', view: 'front' },
  { id: 'extensor_carpi_radialis_longus_r', label: 'Ekstensor Kanan', group: 'Lengan Bawah', view: 'front' },
  { id: 'flexor_digitorum_superficialis_l', label: 'Flexor Jari Kiri', group: 'Lengan Bawah', view: 'front' },
  { id: 'flexor_digitorum_superficialis_r', label: 'Flexor Jari Kanan', group: 'Lengan Bawah', view: 'front' },
  { id: 'pronator_teres_l', label: 'Pronator Kiri', group: 'Lengan Bawah', view: 'front' },
  { id: 'pronator_teres_r', label: 'Pronator Kanan', group: 'Lengan Bawah', view: 'front' },
  { id: 'pronator_quadratus_l', label: 'Pronator Dalam Kiri', group: 'Lengan Bawah', view: 'front' },
  { id: 'pronator_quadratus_r', label: 'Pronator Dalam Kanan', group: 'Lengan Bawah', view: 'front' },
  { id: 'rectus_abdominis_1', label: 'Perut Atas', group: 'Perut', view: 'front' },
  { id: 'rectus_abdominis_2_l', label: 'Perut Kiri Atas', group: 'Perut', view: 'front' },
  { id: 'rectus_abdominis_2_r', label: 'Perut Kanan Atas', group: 'Perut', view: 'front' },
  { id: 'rectus_abdominis_3_l', label: 'Perut Kiri Bawah', group: 'Perut', view: 'front' },
  { id: 'rectus_abdominis_3_r', label: 'Perut Kanan Bawah', group: 'Perut', view: 'front' },
  { id: 'rectus_abdominis_4_l', label: 'Perut Bawah Kiri', group: 'Perut', view: 'front' },
  { id: 'rectus_abdominis_4_r', label: 'Perut Bawah Kanan', group: 'Perut', view: 'front' },
  { id: 'gluteus_medius_2_l', label: 'Glute Kiri', group: 'Glutes', view: 'front' },
  { id: 'gluteus_medius_2_r', label: 'Glute Kanan', group: 'Glutes', view: 'front' },
  { id: 'rectus_femoris_l', label: 'Paha Depan Kiri', group: 'Paha', view: 'front' },
  { id: 'rectus_femoris_r', label: 'Paha Depan Kanan', group: 'Paha', view: 'front' },
  { id: 'vastus_lateralis_l', label: 'Paha Luar Kiri', group: 'Paha', view: 'front' },
  { id: 'vastus_lateralis_r', label: 'Paha Luar Kanan', group: 'Paha', view: 'front' },
  { id: 'vastus_medialis_l', label: 'Paha Dalam Kiri', group: 'Paha', view: 'front' },
  { id: 'vastus_medialis_r', label: 'Paha Dalam Kanan', group: 'Paha', view: 'front' },
  { id: 'sartoris_l', label: 'Sartorius Kiri', group: 'Paha', view: 'front' },
  { id: 'sartoris_r', label: 'Sartorius Kanan', group: 'Paha', view: 'front' },
  { id: 'adductor_longus_l', label: 'Adductor Kiri', group: 'Paha', view: 'front' },
  { id: 'adductor_longus_r', label: 'Adductor Kanan', group: 'Paha', view: 'front' },
  { id: 'gracilis_l', label: 'Gracilis Kiri', group: 'Paha', view: 'front' },
  { id: 'gracilis_r', label: 'Gracilis Kanan', group: 'Paha', view: 'front' },
  { id: 'pectineus_l', label: 'Pectineus Kiri', group: 'Paha', view: 'front' },
  { id: 'pectineus_r', label: 'Pectineus Kanan', group: 'Paha', view: 'front' },
  { id: 'iliotibial_tract_l', label: 'IT Band Kiri', group: 'Paha', view: 'both' },
  { id: 'iliotibial_tract_r', label: 'IT Band Kanan', group: 'Paha', view: 'both' },
  { id: 'semitendinosus_l', label: 'Hamstring Kiri', group: 'Kaki', view: 'both' },
  { id: 'semitendinosus_r', label: 'Hamstring Kanan', group: 'Kaki', view: 'both' },
  { id: 'gastrocnemius_l', label: 'Betis Kiri', group: 'Betis', view: 'both' },
  { id: 'gastrocnemius_r', label: 'Betis Kanan', group: 'Betis', view: 'both' },
  { id: 'tibialis_anterior_l', label: 'Tibialis Kiri', group: 'Betis', view: 'front' },
  { id: 'tibialis_anterior_r', label: 'Tibialis Kanan', group: 'Betis', view: 'front' },
  { id: 'fibularis_longus_l', label: 'Fibularis Kiri', group: 'Betis', view: 'front' },
  { id: 'fibularis_longus_r', label: 'Fibularis Kanan', group: 'Betis', view: 'front' },
  { id: 'extensor_digitorum_longus_l', label: 'Ekstensor Jari Kiri', group: 'Betis', view: 'front' },
  { id: 'extensor_digitorum_longus_r', label: 'Ekstensor Jari Kanan', group: 'Betis', view: 'front' },
  { id: 'extensor_hallucis_longus_l', label: 'Halusis Kiri', group: 'Betis', view: 'front' },
  { id: 'extensor_hallucis_longus_r', label: 'Halusis Kanan', group: 'Betis', view: 'front' },
  { id: 'external_oblique_1_l', label: 'Oblique Kiri 1', group: 'Perut', view: 'front' },
  { id: 'external_oblique_1_r', label: 'Oblique Kanan 1', group: 'Perut', view: 'front' },
  { id: 'external_oblique_2_l', label: 'Oblique Kiri 2', group: 'Perut', view: 'front' },
  { id: 'external_oblique_2_r', label: 'Oblique Kanan 2', group: 'Perut', view: 'front' },
  { id: 'external_oblique_3_l', label: 'Oblique Kiri 3', group: 'Perut', view: 'front' },
  { id: 'external_oblique_3_r', label: 'Oblique Kanan 3', group: 'Perut', view: 'front' },
  { id: 'external_oblique_4_l', label: 'Oblique Kiri 4', group: 'Perut', view: 'front' },
  { id: 'external_oblique_4_r', label: 'Oblique Kanan 4', group: 'Perut', view: 'front' },
  { id: 'external_oblique_5_l', label: 'Oblique Kiri 5', group: 'Perut', view: 'front' },
  { id: 'external_oblique_5_r', label: 'Oblique Kanan 5', group: 'Perut', view: 'front' },
]

const BACK_MUSCLE_DEFS = [
  { id: 'sternocleidomastoid_l', label: 'Sternokleidomastoid Kiri', group: 'Leher', view: 'back' },
  { id: 'sternocleidomastoid_r', label: 'Sternokleidomastoid Kanan', group: 'Leher', view: 'back' },
  { id: 'trapezius_upper_l', label: 'Trap Atas Kiri', group: 'Punggung', view: 'back' },
  { id: 'trapezius_upper_r', label: 'Trap Atas Kanan', group: 'Punggung', view: 'back' },
  { id: 'trapezius_middle_l', label: 'Trap Tengah Kiri', group: 'Punggung', view: 'back' },
  { id: 'trapezius_middle_r', label: 'Trap Tengah Kanan', group: 'Punggung', view: 'back' },
  { id: 'trapezius_lower_l', label: 'Trap Bawah Kiri', group: 'Punggung', view: 'back' },
  { id: 'trapezius_lower_r', label: 'Trap Bawah Kanan', group: 'Punggung', view: 'back' },
  { id: 'latissimus_dorsi_l', label: 'Punggung Lebar Kiri', group: 'Punggung', view: 'back' },
  { id: 'latissimus_dorsi_r', label: 'Punggung Lebar Kanan', group: 'Punggung', view: 'back' },
  { id: 'infraspinatus_l', label: 'Infraspinatus Kiri', group: 'Punggung', view: 'back' },
  { id: 'infraspinatus_r', label: 'Infraspinatus Kanan', group: 'Punggung', view: 'back' },
  { id: 'posterior_deltoid_l', label: 'Deltoid Belakang Kiri', group: 'Bahu', view: 'back' },
  { id: 'posterior_deltoid_r', label: 'Deltoid Belakang Kanan', group: 'Bahu', view: 'back' },
  { id: 'lateral_deltoid_l', label: 'Deltoid Samping Kiri', group: 'Bahu', view: 'back' },
  { id: 'lateral_deltoid_r', label: 'Deltoid Samping Kanan', group: 'Bahu', view: 'back' },
  { id: 'triceps_brachii_caput_longum_l', label: 'Triceps Panjang Kiri', group: 'Triceps', view: 'back' },
  { id: 'triceps_brachii_caput_longum_r', label: 'Triceps Panjang Kanan', group: 'Triceps', view: 'back' },
  { id: 'triceps_brachii_caput_laterale_l', label: 'Triceps Lateral Kiri', group: 'Triceps', view: 'back' },
  { id: 'triceps_brachii_caput_laterale_r', label: 'Triceps Lateral Kanan', group: 'Triceps', view: 'back' },
  { id: 'triceps_brachii_caput_mediale_l', label: 'Triceps Medial Kiri', group: 'Triceps', view: 'back' },
  { id: 'triceps_brachii_caput_mediale_r', label: 'Triceps Medial Kanan', group: 'Triceps', view: 'back' },
  { id: 'anconeus_l', label: 'Anconeus Kiri', group: 'Lengan Bawah', view: 'back' },
  { id: 'anconeus_r', label: 'Anconeus Kanan', group: 'Lengan Bawah', view: 'back' },
  { id: 'brachioradialis_l', label: 'Brachioradialis Kiri', group: 'Lengan Bawah', view: 'back' },
  { id: 'brachioradialis_r', label: 'Brachioradialis Kanan', group: 'Lengan Bawah', view: 'back' },
  { id: 'extensor_carpi_ulnaris_l', label: 'Ekstensor Carpi Ulnaris Kiri', group: 'Lengan Bawah', view: 'back' },
  { id: 'extensor_carpi_ulnaris_r', label: 'Ekstensor Carpi Ulnaris Kanan', group: 'Lengan Bawah', view: 'back' },
  { id: 'extensor_digitorum_l', label: 'Ekstensor Digitorum Kiri', group: 'Lengan Bawah', view: 'back' },
  { id: 'extensor_digitorum_r', label: 'Ekstensor Digitorum Kanan', group: 'Lengan Bawah', view: 'back' },
  { id: 'flexor_carpi_ulnaris_l', label: 'Flexor Carpi Ulnaris Kiri', group: 'Lengan Bawah', view: 'back' },
  { id: 'flexor_carpi_ulnaris_r', label: 'Flexor Carpi Ulnaris Kanan', group: 'Lengan Bawah', view: 'back' },
  { id: 'gluteus_maximus_l', label: 'Glute Max Kiri', group: 'Glutes', view: 'back' },
  { id: 'gluteus_maximus_r', label: 'Glute Max Kanan', group: 'Glutes', view: 'back' },
  { id: 'gluteus_medius_1_l', label: 'Glute Medius 1 Kiri', group: 'Glutes', view: 'back' },
  { id: 'gluteus_medius_1_r', label: 'Glute Medius 1 Kanan', group: 'Glutes', view: 'back' },
  { id: 'gluteus_medius_2_l', label: 'Glute Medius 2 Kiri', group: 'Glutes', view: 'back' },
  { id: 'gluteus_medius_2_r', label: 'Glute Medius 2 Kanan', group: 'Glutes', view: 'back' },
  { id: 'iliotibial_tract_l', label: 'IT Band Kiri', group: 'Paha', view: 'back' },
  { id: 'iliotibial_tract_r', label: 'IT Band Kanan', group: 'Paha', view: 'back' },
  { id: 'biceps_femoris_l', label: 'Biceps Femoris Kiri', group: 'Paha', view: 'back' },
  { id: 'biceps_femoris_r', label: 'Biceps Femoris Kanan', group: 'Paha', view: 'back' },
  { id: 'semimembranosus_1_l', label: 'Semimembranosus 1 Kiri', group: 'Paha', view: 'back' },
  { id: 'semimembranosus_1_r', label: 'Semimembranosus 1 Kanan', group: 'Paha', view: 'back' },
  { id: 'semimembranosus_2_l', label: 'Semimembranosus 2 Kiri', group: 'Paha', view: 'back' },
  { id: 'semimembranosus_2_r', label: 'Semimembranosus 2 Kanan', group: 'Paha', view: 'back' },
  { id: 'semitendinosus_l', label: 'Semitendinosus Kiri', group: 'Paha', view: 'back' },
  { id: 'semitendinosus_r', label: 'Semitendinosus Kanan', group: 'Paha', view: 'back' },
  { id: 'adductor_magnus_l', label: 'Adductor Magnus Kiri', group: 'Paha', view: 'back' },
  { id: 'adductor_magnus_r', label: 'Adductor Magnus Kanan', group: 'Paha', view: 'back' },
  { id: 'gastrocnemius_l', label: 'Betis Kiri', group: 'Betis', view: 'back' },
  { id: 'gastrocnemius_r', label: 'Betis Kanan', group: 'Betis', view: 'back' },
]

export const MUSCLE_DEFS = [...FRONT_MUSCLE_DEFS, ...BACK_MUSCLE_DEFS]

export const MUSCLE_BY_ID = Object.fromEntries(MUSCLE_DEFS.map(m => [m.id, m]))

export const MUSCLE_GROUPS = {}
for (const m of MUSCLE_DEFS) {
  if (!MUSCLE_GROUPS[m.group]) MUSCLE_GROUPS[m.group] = []
  MUSCLE_GROUPS[m.group].push(m)
}

export const VIEW_MUSCLE_IDS = {
  front: new Set(
    FRONT_MUSCLE_DEFS.map(m => m.id)
  ),
  back: new Set(
    BACK_MUSCLE_DEFS.map(m => m.id)
  ),
}

export const ALL_FRONT_MUSCLE_IDS = [...VIEW_MUSCLE_IDS.front]
export const ALL_BACK_MUSCLE_IDS = [...VIEW_MUSCLE_IDS.back]
export const ALL_MUSCLE_IDS = [...new Set([...ALL_FRONT_MUSCLE_IDS, ...ALL_BACK_MUSCLE_IDS])]

const CATEGORY_FRONT_IDS = {
  Dada: [
    'pectoralis_major_upper_l', 'pectoralis_major_upper_r',
    'pectoralis_major_lower_l', 'pectoralis_major_lower_r',
  ],
  Punggung: ['latissimus_dorsi_l', 'latissimus_dorsi_r', 'trapezius_upper_l', 'trapezius_upper_r'],
  Bahu: ['anterior_deltoid_l', 'anterior_deltoid_r', 'lateral_deltoid_l', 'lateral_deltoid_r'],
  Biceps: ['biceps_brachii_caput_longum_l', 'biceps_brachii_caput_longum_r', 'biceps_brachii_caput_breve_l', 'biceps_brachii_caput_breve_r'],
  Triceps: ['triceps_brachii_caput_longum_l', 'triceps_brachii_caput_longum_r', 'triceps_brachii_caput_laterale_l', 'triceps_brachii_caput_laterale_r'],
  'Lengan Bawah': [
    'brachioradialis_l', 'brachioradialis_r',
    'flexor_carpi_radialis_l', 'flexor_carpi_radialis_r',
    'palmaris_longus_l', 'palmaris_longus_r',
    'extensor_carpi_radialis_longus_l', 'extensor_carpi_radialis_longus_r',
    'flexor_digitorum_superficialis_l', 'flexor_digitorum_superficialis_r',
    'pronator_teres_l', 'pronator_teres_r',
    'pronator_quadratus_l', 'pronator_quadratus_r',
  ],
  Betis: [
    'gastrocnemius_l', 'gastrocnemius_r',
    'tibialis_anterior_l', 'tibialis_anterior_r',
    'fibularis_longus_l', 'fibularis_longus_r',
    'extensor_digitorum_longus_l', 'extensor_digitorum_longus_r',
    'extensor_hallucis_longus_l', 'extensor_hallucis_longus_r',
  ],
  Glutes: ['gluteus_medius_2_l', 'gluteus_medius_2_r'],
  Perut: [
    'rectus_abdominis_1',
    'rectus_abdominis_2_l', 'rectus_abdominis_2_r',
    'rectus_abdominis_3_l', 'rectus_abdominis_3_r',
    'rectus_abdominis_4_l', 'rectus_abdominis_4_r',
    'external_oblique_1_l', 'external_oblique_1_r',
    'external_oblique_2_l', 'external_oblique_2_r',
    'external_oblique_3_l', 'external_oblique_3_r',
    'external_oblique_4_l', 'external_oblique_4_r',
    'external_oblique_5_l', 'external_oblique_5_r',
  ],
  Paha: [
    'rectus_femoris_l', 'rectus_femoris_r',
    'vastus_lateralis_l', 'vastus_lateralis_r',
    'vastus_medialis_l', 'vastus_medialis_r',
    'sartoris_l', 'sartoris_r',
    'iliotibial_tract_l', 'iliotibial_tract_r',
    'adductor_longus_l', 'adductor_longus_r',
    'gracilis_l', 'gracilis_r',
    'pectineus_l', 'pectineus_r',
  ],
  Kaki: [
    'rectus_femoris_l', 'rectus_femoris_r',
    'vastus_lateralis_l', 'vastus_lateralis_r',
    'vastus_medialis_l', 'vastus_medialis_r',
    'sartoris_l', 'sartoris_r',
    'iliotibial_tract_l', 'iliotibial_tract_r',
    'adductor_longus_l', 'adductor_longus_r',
    'gracilis_l', 'gracilis_r',
    'pectineus_l', 'pectineus_r',
    'semitendinosus_l', 'semitendinosus_r',
    'gastrocnemius_l', 'gastrocnemius_r',
    'tibialis_anterior_l', 'tibialis_anterior_r',
    'fibularis_longus_l', 'fibularis_longus_r',
    'extensor_digitorum_longus_l', 'extensor_digitorum_longus_r',
    'extensor_hallucis_longus_l', 'extensor_hallucis_longus_r',
    'gluteus_medius_2_l', 'gluteus_medius_2_r',
  ],
  Trap: ['trapezius_upper_l', 'trapezius_upper_r'],
  'Adductor/Abductor': [
    'adductor_longus_l', 'adductor_longus_r',
    'gracilis_l', 'gracilis_r',
    'pectineus_l', 'pectineus_r',
  ],
}

const CATEGORY_BACK_IDS = {
  Punggung: [
    'trapezius_upper_l', 'trapezius_upper_r',
    'trapezius_middle_l', 'trapezius_middle_r',
    'trapezius_lower_l', 'trapezius_lower_r',
    'latissimus_dorsi_l', 'latissimus_dorsi_r',
    'infraspinatus_l', 'infraspinatus_r',
  ],
  Bahu: [
    'posterior_deltoid_l', 'posterior_deltoid_r',
    'lateral_deltoid_l', 'lateral_deltoid_r',
  ],
  Triceps: [
    'triceps_brachii_caput_longum_l', 'triceps_brachii_caput_longum_r',
    'triceps_brachii_caput_laterale_l', 'triceps_brachii_caput_laterale_r',
    'triceps_brachii_caput_mediale_l', 'triceps_brachii_caput_mediale_r',
  ],
  'Lengan Bawah': [
    'anconeus_l', 'anconeus_r',
    'brachioradialis_l', 'brachioradialis_r',
    'extensor_carpi_ulnaris_l', 'extensor_carpi_ulnaris_r',
    'extensor_digitorum_l', 'extensor_digitorum_r',
    'flexor_carpi_ulnaris_l', 'flexor_carpi_ulnaris_r',
  ],
  Glutes: [
    'gluteus_maximus_l', 'gluteus_maximus_r',
    'gluteus_medius_1_l', 'gluteus_medius_1_r',
    'gluteus_medius_2_l', 'gluteus_medius_2_r',
  ],
  Paha: [
    'iliotibial_tract_l', 'iliotibial_tract_r',
    'biceps_femoris_l', 'biceps_femoris_r',
    'semimembranosus_1_l', 'semimembranosus_1_r',
    'semimembranosus_2_l', 'semimembranosus_2_r',
    'semitendinosus_l', 'semitendinosus_r',
    'adductor_magnus_l', 'adductor_magnus_r',
  ],
  Kaki: [
    'iliotibial_tract_l', 'iliotibial_tract_r',
    'biceps_femoris_l', 'biceps_femoris_r',
    'semimembranosus_1_l', 'semimembranosus_1_r',
    'semimembranosus_2_l', 'semimembranosus_2_r',
    'semitendinosus_l', 'semitendinosus_r',
    'adductor_magnus_l', 'adductor_magnus_r',
    'gluteus_maximus_l', 'gluteus_maximus_r',
    'gluteus_medius_1_l', 'gluteus_medius_1_r',
    'gluteus_medius_2_l', 'gluteus_medius_2_r',
    'gastrocnemius_l', 'gastrocnemius_r',
  ],
  Betis: ['gastrocnemius_l', 'gastrocnemius_r'],
  Leher: ['sternocleidomastoid_l', 'sternocleidomastoid_r'],
  Trap: [
    'trapezius_upper_l', 'trapezius_upper_r',
    'trapezius_middle_l', 'trapezius_middle_r',
    'trapezius_lower_l', 'trapezius_lower_r',
  ],
  'Adductor/Abductor': [
    'adductor_magnus_l', 'adductor_magnus_r',
    'biceps_femoris_l', 'biceps_femoris_r',
    'semitendinosus_l', 'semitendinosus_r',
  ],
  'Punggung Bawah': [
    'gluteus_maximus_l', 'gluteus_maximus_r',
    'gluteus_medius_1_l', 'gluteus_medius_1_r',
    'gluteus_medius_2_l', 'gluteus_medius_2_r',
    'semitendinosus_l', 'semitendinosus_r',
    'biceps_femoris_l', 'biceps_femoris_r',
  ],
}

export const CATEGORY_TO_ALL_MUSCLE_IDS = {}
for (const [cat, ids] of Object.entries(CATEGORY_FRONT_IDS)) {
  CATEGORY_TO_ALL_MUSCLE_IDS[cat] = [...ids]
}
for (const [cat, ids] of Object.entries(CATEGORY_BACK_IDS)) {
  if (CATEGORY_TO_ALL_MUSCLE_IDS[cat]) {
    for (const id of ids) {
      if (!CATEGORY_TO_ALL_MUSCLE_IDS[cat].includes(id)) {
        CATEGORY_TO_ALL_MUSCLE_IDS[cat].push(id)
      }
    }
  } else {
    CATEGORY_TO_ALL_MUSCLE_IDS[cat] = [...ids]
  }
}

export function getCategoryMuscleIds(category, view) {
  if (view === 'front') return CATEGORY_FRONT_IDS[category] || []
  if (view === 'back') return CATEGORY_BACK_IDS[category] || []
  return CATEGORY_TO_ALL_MUSCLE_IDS[category] || []
}
