// components/TimePicker.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal, Platform, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePicker = ({ label, value, onChange, testID }) => {
  const [show, setShow] = useState(false);

  // Convert string time "HH:mm" to Date object
  const getDateFromTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 9, minutes || 0, 0, 0);
    return date;
  };

  const [currentDate, setCurrentDate] = useState(getDateFromTimeString(value));

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      if (selectedDate) {
        setCurrentDate(selectedDate);
      }
    } else {
      setShow(false);
      if (selectedDate) {
        const formattedTime = selectedDate.toTimeString().slice(0, 5);
        onChange(formattedTime);
      }
    }
  };

  const handleConfirm = () => {
    setShow(false);
    const formattedTime = currentDate.toTimeString().slice(0, 5);
    onChange(formattedTime);
  };

  const displayTime = value || '--:--';

  return (
    <>
      <TouchableOpacity
        testID={testID}
        className="flex-1 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-4"
        onPress={() => setShow(true)}
        activeOpacity={0.7}>
        <Text className="mb-1 text-xs font-medium text-gray-500">{label}</Text>
        <Text className="text-base font-semibold text-gray-900">{displayTime}</Text>
      </TouchableOpacity>

      {show && Platform.OS === 'ios' ? (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          onRequestClose={() => setShow(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <View className="rounded-t-3xl bg-white pb-8">
              <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text className="text-base text-gray-500">إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text className="text-base font-semibold text-amber-600">تم</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={currentDate}
                mode="time"
                display="spinner"
                onChange={handleChange}
                textColor="#000"
              />
            </View>
          </View>
        </Modal>
      ) : show && Platform.OS === 'android' ? (
        <DateTimePicker value={currentDate} mode="time" display="default" onChange={handleChange} />
      ) : null}
    </>
  );
};

export default TimePicker;
