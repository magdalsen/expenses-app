import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react"
import { useForm } from "react-hook-form";
import { buttonData, months } from "./constans/constans";
import { useUserContext } from "../context/UserContext";
import { schemaAddMonth } from "./validation/validation";
import { addMonth, fetchDataByRow } from "../api/api";
import { AddMonthData } from "./constans/types";
import { SaveButton } from "./common/Buttons";
import { formatDate, todayDate } from "./utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotificationContext } from "../context/NotificationContext";

export const AddMonthModal = () => {
    const { toggleAlertSuccess, toggleAlertError } = useNotificationContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { userId }=useUserContext();
    const queryClient = useQueryClient();
  
    const initialRef = React.useRef(null);

    const { register, handleSubmit, formState: { errors } } = useForm<AddMonthData>({
        defaultValues: {
          income: 0,
          month: '',
          year: 0
        },
        resolver: yupResolver(schemaAddMonth)
      });
      const onSubmit = (data: AddMonthData) => {
        mutation.mutate(data);
      }
      
    const { data:years, isLoading, error} = useQuery({
      queryKey: ['years'],
      queryFn: () => fetchDataByRow(userId).then((data)=>{
          return formatDate(data)
      })
    })

    const mutation = useMutation({
      mutationFn: (values:AddMonthData) => {
        return addMonth(values, userId, toggleAlertSuccess, toggleAlertError)
      },
      onSuccess: (values) => {
        queryClient.invalidateQueries({ queryKey: values })
      },
      onError: () => {
        throw new Error("Something went wrong :(");
      }
    })

    if (isLoading) {
      return <div>Loading...</div>
    }
    if (error) {
      return <div>Error! Contact with administrator.</div>
    }

    return (
      <>
        <Button onClick={onOpen}>Add month</Button>
  
        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add month</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <FormLabel>Month:</FormLabel>
                        <Select {...register("month")} placeholder='Select month'>
                            {months.map((el)=>(
                                <option key={el.month} value={el.month}>{el.month}</option>
                            ))}
                        </Select>
                        <p>{errors.month?.message}</p>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Year:</FormLabel>
                        <Select {...register("year")} placeholder='Select year'>
                            {years?.length !== 0 ? years?.map((el)=>(
                              <option key={el} value={el}>{el}</option>
                            )) :
                            <option key={todayDate} value={todayDate}>{todayDate}</option>}
                        </Select>
                        <p>{errors.month?.message}</p>
                    </FormControl>
                    
                    <FormControl>
                        <FormLabel>Income in zł:</FormLabel>
                        <Input {...register("income")} type="number" placeholder="Income" />
                        <p>{errors.income?.message}</p>
                    </FormControl>
                    <ModalFooter>
                        <SaveButton value={buttonData.saveButton} />
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }