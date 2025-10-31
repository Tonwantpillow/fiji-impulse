// Order status colors configuration
export const ORDER_STATUS_COLORS = {
  // Thai status names
  'รอชำระเงิน': {
    bg: 'bg-orange-500',
    text: 'text-white',
    border: 'border-orange-500',
    light: 'bg-orange-100',
    dark: 'bg-orange-600'
  },
  'รอตรวจสอบหลักฐาน': {
    bg: 'bg-yellow-500',
    text: 'text-white',
    border: 'border-yellow-500',
    light: 'bg-yellow-100',
    dark: 'bg-yellow-600'
  },
  'หลักฐานการชำระเงินถูกปฏิเสธ': {
    bg: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-500',
    light: 'bg-red-100',
    dark: 'bg-red-600'
  },
  'ยืนยันการชำระแล้ว': {
    bg: 'bg-blue-500',
    text: 'text-white',
    border: 'border-blue-500',
    light: 'bg-blue-100',
    dark: 'bg-blue-600'
  },
  'สินค้าผลิตแล้ว': {
    bg: 'bg-purple-500',
    text: 'text-white',
    border: 'border-purple-500',
    light: 'bg-purple-100',
    dark: 'bg-purple-600'
  },
  'รอจัดส่ง': {
    bg: 'bg-indigo-500',
    text: 'text-white',
    border: 'border-indigo-500',
    light: 'bg-indigo-100',
    dark: 'bg-indigo-600'
  },
  'กำลังจัดส่ง': {
    bg: 'bg-teal-500',
    text: 'text-white',
    border: 'border-teal-500',
    light: 'bg-teal-100',
    dark: 'bg-teal-600'
  },
  'จัดส่งแล้ว': {
    bg: 'bg-green-500',
    text: 'text-white',
    border: 'border-green-500',
    light: 'bg-green-100',
    dark: 'bg-green-600'
  },
  'กำลังเตรียมสินค้า': {
    bg: 'bg-amber-500',
    text: 'text-white',
    border: 'border-amber-500',
    light: 'bg-amber-100',
    dark: 'bg-amber-600'
  },
  'สำเร็จแล้ว': {
    bg: 'bg-green-600',
    text: 'text-white',
    border: 'border-green-600',
    light: 'bg-green-200',
    dark: 'bg-green-700'
  },
  'กำลังเตรียมสินค้า': {
    bg: 'bg-amber-500',
    text: 'text-white',
    border: 'border-amber-500',
    light: 'bg-amber-100',
    dark: 'bg-amber-600'
  },

  // Default fallback for unknown statuses
  'default': {
    bg: 'bg-gray-500',
    text: 'text-white',
    border: 'border-gray-500',
    light: 'bg-gray-100',
    dark: 'bg-gray-600'
  }
};

// Function to get status color configuration
export const getStatusColor = (status: string) => {
  return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || ORDER_STATUS_COLORS.default;
};

// Function to get status badge classes
export const getStatusBadgeClasses = (status: string) => {
  const color = getStatusColor(status);
  return `${color.bg} ${color.text} ${color.border}`;
};