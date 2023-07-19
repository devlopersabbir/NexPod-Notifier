import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { TSendType } from "./utils/types";
import axios from "axios";
import { toast } from "react-hot-toast";

const App = () => {
  const [webHookURL, setWebHookURL] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [sendType, setSendType] = useState<TSendType>("text");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [contentMessage, setContentMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submitHandlerWithText = async () => {
    if (!webHookURL || !mobileNumber || !contentMessage)
      return toast.error("Please input required fill!");

    setLoading(true);
    const data = {
      action: "send-message",
      type: "text",
      content: contentMessage,
      phone: `${mobileNumber}`,
    };
    try {
      await axios.post(`${webHookURL}`, data);
      toast.success("Message send successfull!");

      chrome.storage.sync.set({ webHookURL });
    } catch (error) {
      if (error) {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };
  const submitHandlerWithMedia = async () => {
    if (!webHookURL || !mobileNumber || !contentMessage)
      return toast.error("Please input required fill!");
    setLoading(true);
    const data = {
      action: "send-message",
      type: "media",
      content: contentMessage,
      phone: `${mobileNumber}`,
      attachments: [`${mediaUrl}`],
    };
    try {
      await axios.post(`${webHookURL}`, data);

      chrome.storage.sync.set({ webHookURL });
      toast.success("Message send successfull!");
    } catch (error) {
      if (error) {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chrome.storage.sync
      .get(["selectedText", "webHookURL", "mobileNumber"])
      .then((res) => {
        setMobileNumber(res?.selectedText);
        setWebHookURL(res?.webHookURL);
        setMobileNumber(res?.mobileNumber);
      })
      .catch(() => toast.error("Fail to get number!"));
  }, []);
  return (
    <Container maxW="400px" w="400px" p={4} mx="auto" bg="gray.900">
      <Box w="full" textAlign="center" color="white" mb={3}>
        <Heading fontSize="2xl">Webhook Notifier</Heading>
      </Box>
      <Flex flexDir="column" gap={2}>
        <FormControl isRequired>
          <FormLabel color="white">WebHook URL</FormLabel>
          <Input
            value={webHookURL}
            onChange={(e) => setWebHookURL(e.target.value)}
            color="white"
            fontWeight="semibold"
            type="text"
            placeholder="WebHook URL"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="white">Mobile</FormLabel>
          <Input
            value={mobileNumber}
            color="white"
            onChange={(e) => setMobileNumber(e.target.value)}
            fontWeight="semibold"
            type="text"
            placeholder="Mobile number"
          />
        </FormControl>
        <FormControl>
          <FormLabel color="white">Type</FormLabel>
          <Select
            color="white"
            fontWeight="semibold"
            bg="gray.900"
            value={sendType}
            onChange={(e) => setSendType(e.target.value as TSendType)}
          >
            <option
              style={{ color: "white", backgroundColor: "gray" }}
              value="text"
            >
              Text
            </option>
            <option
              value="media"
              style={{ color: "white", backgroundColor: "gray" }}
            >
              Media
            </option>
          </Select>
        </FormControl>
        {sendType === "text" ? null : (
          <FormControl>
            <FormLabel color="white">Media URL</FormLabel>
            <Input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              color="white"
              fontWeight="semibold"
              type="text"
              placeholder="Media url"
            />
          </FormControl>
        )}

        <FormControl isRequired>
          <FormLabel color="white"> Content</FormLabel>
            <Textarea
              contentEditable="true"
              rows={7}
              value={contentMessage}
              onChange={(e) => setContentMessage(e.target.value)}
              color="white"
              fontWeight="semibold"
              placeholder="Enter your message here..."
            />
        </FormControl>
        <Button
          type="button"
          variant="solid"
          colorScheme="linkedin"
          onClick={
            sendType === "text" ? submitHandlerWithText : submitHandlerWithMedia
          }
        >
          {loading ? <Spinner /> : "Submit"}
        </Button>
      </Flex>
    </Container>
  );
};

export default App;
