import { StatusBar } from 'expo-status-bar'
import { Layout } from '../common/Layout/Layout'
import { DatabaseService } from '../database/Database'
import * as SQLite from 'expo-sqlite'
import { Header } from '../modules/notes/_components/Header/Header'
import { Texto } from '../common/Texto/Texto'
import {
  View,
  StyleSheet,
  FlatList,
  ViewStyle,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Button,
} from 'react-native'
import theme, { NoteColors } from '../theme'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import Animated, { ZoomIn } from 'react-native-reanimated'
import { Formik, FormikErrors } from 'formik'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ColorOption {
  color: string
  value: NoteColors
}

const COLOR_OPTIONS: ColorOption[] = [
  {
    color: theme.colors.notes.pastelDarkPurple,
    value: 'pastelDarkPurple',
  },
  {
    color: theme.colors.notes.pastelLightPurple,
    value: 'pastelLightPurple',
  },
  {
    color: theme.colors.notes.pastelPink,
    value: 'pastelPink',
  },
  {
    color: theme.colors.notes.pastelOrange,
    value: 'pastelOrange',
  },
  {
    color: theme.colors.notes.pastelYellow,
    value: 'pastelYellow',
  },
  {
    color: theme.colors.notes.pastelGreen,
    value: 'pastelGreen',
  },
  {
    color: theme.colors.notes.pastelLightBlue,
    value: 'pastelLightBlue',
  },
  {
    color: theme.colors.notes.pastelDarkBlue,
    value: 'pastelDarkBlue',
  },
]

export const AddNote = () => {
  const [selectedColor, setSelectedColor] =
    useState<NoteColors>('pastelDarkPurple')

  const databaseService = new DatabaseService(
    SQLite.openDatabase('db.notikasDB')
  )

  const circleInput = (color: string): ViewStyle => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color,
    borderRadius: 100,
    height: 34,
    width: 34,
  })

  const checkedCircle = (colorOption: ColorOption): ViewStyle => {
    if (colorOption.value === selectedColor) {
      return {
        width: 45,
        height: 45,
        borderRadius: 100,
        borderColor: colorOption.color,
        borderWidth: 2.5,
      }
    }
    return {}
  }

  const checkedButton = (color: NoteColors): ViewStyle => {
    return {
      backgroundColor: theme.colors.notes[color],
      borderRadius: 10,
      height: 150,
      width: 150,
      padding: 30,
    }
  }

  const handleColorChange = (colorOption: ColorOption) => {
    setSelectedColor(colorOption.value)
  }

  const handleNoteCreation = (values: FormValues) => {
    const { fileCreated, color, noteName } = values
    console.log(`${fileCreated} + ${color} + ${noteName}`)
  }

  type ItemProps = {
    colorOption: ColorOption
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<void | FormikErrors<FormValues>>
  }
  const Item = ({ colorOption, setFieldValue }: ItemProps) => (
    <Pressable
      style={circleInput(colorOption.color)}
      onPress={() => {
        handleColorChange(colorOption)
        setFieldValue('color', colorOption.value)
      }}
    >
      <Animated.View
        style={checkedCircle(colorOption)}
        entering={ZoomIn.duration(400)}
      />
    </Pressable>
  )

  interface FormValues {
    fileCreated: string
    color: string
    noteName: string
  }

  const initialValues: FormValues = {
    fileCreated: 'note',
    color: selectedColor,
    noteName: '',
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <StatusBar style="auto" />
        <ScrollView>
          <Layout>
            <Header />
            <Formik initialValues={initialValues} onSubmit={handleNoteCreation}>
              {({
                handleChange,
                setFieldValue,
                handleSubmit,
                values,
                isValid,
              }) => (
                <>
                  <Texto estilo="montserratBold" marginBottom="medium">
                    ¿Qué deseas crear?
                  </Texto>
                  <View style={styles.buttonContainer}>
                    <Pressable
                      onPress={() => {
                        setFieldValue('fileCreated', 'note')
                      }}
                    >
                      <Animated.View
                        style={
                          values.fileCreated === 'note'
                            ? checkedButton(selectedColor)
                            : styles.button
                        }
                        entering={ZoomIn.duration(400)}
                      >
                        <Pressable
                          style={styles.buttonContent}
                          onPress={() => setFieldValue('fileCreated', 'note')}
                        >
                          <FontAwesome name="file" size={24} color="black" />
                          <Texto estilo="montserratBold">Una nota</Texto>
                        </Pressable>
                      </Animated.View>
                    </Pressable>
                    <Pressable
                      onPress={() => setFieldValue('fileCreated', 'folder')}
                    >
                      <Animated.View
                        style={
                          values.fileCreated === 'folder'
                            ? checkedButton(selectedColor)
                            : styles.button
                        }
                        entering={ZoomIn.duration(400)}
                      >
                        <Pressable
                          style={styles.buttonContent}
                          onPress={() => setFieldValue('fileCreated', 'folder')}
                        >
                          <FontAwesome
                            name="folder-open"
                            size={30}
                            color="black"
                          />
                          <Texto estilo="montserratBold">Una carpeta</Texto>
                        </Pressable>
                      </Animated.View>
                    </Pressable>
                  </View>
                  <Pressable onPress={() => console.log(values.color)}>
                    <Texto estilo="montserratBold" marginBottom="medium">
                      Elige un color para mostrarla
                    </Texto>
                  </Pressable>

                  <View>
                    <FlatList
                      data={COLOR_OPTIONS}
                      contentContainerStyle={styles.colorPickerContainer}
                      overScrollMode="auto"
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <Item
                          colorOption={item}
                          setFieldValue={setFieldValue}
                        />
                      )}
                    />
                  </View>
                  <Texto estilo="montserratBold" marginBottom="medium">
                    ¿Cómo la vas a llamar?
                  </Texto>

                  <View style={styles.searchSection}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color="black"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={styles.noteInput}
                      placeholder="Escribe aquí el nombre"
                      onChangeText={handleChange('noteName')}
                    />
                  </View>

                  <Button
                    title="E_nviar"
                    onPress={() => {
                      if (isValid) {
                        handleSubmit()
                      }
                    }}
                  ></Button>
                </>
              )}
            </Formik>
          </Layout>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.large,
  },
  button: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    height: 150,
    width: 150,
    padding: 30,
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xsmall,
    flexGrow: 1,
  },
  colorPickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.small,
    minHeight: 60,
    paddingHorizontal: theme.spacing.xsmall,
    marginBottom: theme.spacing.large,
  },
  searchSection: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  searchIcon: {
    paddingHorizontal: 15,
  },
  noteInput: {
    minHeight: 50,
    flexGrow: 1,
    fontFamily: theme.fonts.montserratRegular,
  },
})
