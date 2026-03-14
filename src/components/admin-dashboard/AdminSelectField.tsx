import { ChevronDown } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

type AdminSelectFieldProps<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};

export function AdminSelectField<T extends string>({
  value,
  options,
  onChange,
}: AdminSelectFieldProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    return options.find((option) => option.value === value)?.label ?? value;
  }, [options, value]);

  return (
    <>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={styles.selectText}>{selectedLabel}</Text>
        <ChevronDown size={16} color="#7D8AA4" />
      </Pressable>

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.menu} onPress={() => undefined}>
            {options.map((option) => {
              const active = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}>
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  select: {
    height: 44,
    borderRadius: 9,
    backgroundColor: '#172338',
    borderWidth: 1,
    borderColor: '#2A3A53',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: '#AAB5C9',
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#01091BCC',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  menu: {
    borderRadius: 12,
    backgroundColor: '#0A162D',
    borderWidth: 1,
    borderColor: '#263752',
    padding: 8,
  },
  option: {
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  optionActive: {
    backgroundColor: '#15304A',
  },
  optionText: {
    color: '#D8DEEA',
    fontSize: 15,
  },
  optionTextActive: {
    color: '#12D7CC',
    fontWeight: '700',
  },
});
