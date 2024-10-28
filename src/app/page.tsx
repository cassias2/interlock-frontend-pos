"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Grid, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";

import DialogComponent from "../components/DialogComponent";
import DialogLogin from "../components/DialogLogin";
import ResultPaper from "../components/ResultPaper";

import {
  fetchInterlockAccess,
  fetchInterlockAccessAdmAndCloseLot,
  fetchInterlockByLot,
  validateAdminInterlock,
  validateInterlock,
} from "@/service/api";

import { AuthContext, AuthData } from "@/context/AuthContext";

import ListComponent from "@/components/ListComponent";
import ByPassModal from "@/components/ByPassModal";
import { AdminInterlockRequest, InterlockRequest } from "@/interface";

const MainPage: React.FC = () => {
  const [lotValue, setLotValue] = useState<string>("");
  const [partNumberValue, setPartNumberValue] = useState<string>("");
  const [snValue, setSnValue] = useState<string>("");
  const [snValueFormatted, setSnValueFormatted] = useState<string>("");
  const [snValueOld, setSnValueOld] = useState<string>("");
  const [result, setResult] = useState<string>("PENDING");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [interlockData, setInterlockData] = useState<any>({});
  const [interlockDataModal, setInterlockDataModal] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [readyCount, setReadyCount] = useState<number>(0);
  const [filledCount, setFilledCount] = useState<number>(0);
  const [passAndIgnoreCount, setPassAndIgnoreCount] = useState<number>(0);
  const [lotPartDisabled, setLotPartDisabled] = useState<boolean>(false);
  const lotInputRef = useRef<HTMLInputElement>(null);
  const snInputRef = useRef<HTMLInputElement>(null);
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [showByPassModal, setShowByPassModal] = useState<boolean>(false);
  const [accessToCloseLot, setAccessToCloseLot] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const {
    matricula,
    setMatricula,
    password,
    setPassword,
    setError: setLoginError,
  }: AuthData = useContext(AuthContext);

  const resetState = () => {
    setMatricula("");
    setPassword("");
    setLotPartDisabled(false);
    setPartNumberValue("");
    setResult("WAITING");
    setSnValue("");
    setSnValueOld("");
    setInterlockDataModal({});
    setFilledCount(0);
    setReadyCount(0);
    setPassAndIgnoreCount(0);
    setInterlockData({});
    setError("");
  };

  useEffect(() => {
    if (!showByPassModal && lotInputRef.current) {
      lotInputRef.current.focus();
    }
  }, [showByPassModal]);

  const handleUserLogin = async (matricula: string, password: string) => {
    try {
      const response = await fetchInterlockAccess(matricula, password);

      setAccessToCloseLot(true);

      setMatricula(response.user.matricula);
      setPassword(response.user.password);
      setShowLoginDialog(false);

      if (response.count != 0 && response.ready != 0) {
        setFilledCount(response.count);
        setReadyCount(response.ready);
        setLotValue(response.lote);
        setPassAndIgnoreCount(response.passAndIgnore);
        setPartNumberValue(response.partnumber);
        setSnValueOld(response.serial);
        setLotPartDisabled(true);
        setLoading(true);

        await fetchInterlockByLot(response.lote)
          .then((data) => {
            if (!data.status) {
              setInterlockData(data);
              setFilledCount(data.count);
              setReadyCount(data.ready);
              setPassAndIgnoreCount(data.passAndIgnore);

              snInputRef.current?.focus();
            } else {
              setInterlockData([]);
              setLotValue("");
            }

            setError(data.message ?? null);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            setResult("PENDING");
            setError(
              "Erro ao buscar Interlocks por lote. Por favor, verifique o lote e tente novamente."
            );
          });
      }

      return response;
    } catch (error: any) {
      setMatricula("");
      setPassword("");
      setLoginError("Erro ao realizar login");
      console.error("Erro ao fazer login do usuário");
    }
  };

  const handleByPass = async (matricula: string, password: string) => {
    try {
      const response: any = await fetchInterlockAccessAdmAndCloseLot(
        matricula,
        password,
        lotValue
      );
      if (!response.status) {
        setFilledCount(response.count);
        setReadyCount(response.ready);
        setLotValue(response.lote || "");
        setPassAndIgnoreCount(response.passAndIgnore);
        setPartNumberValue(response.partnumber);
        setSnValueOld("");
        setSnValue("");
        setLotPartDisabled(true);

        if (response.lote) {
          setLoading(true);
          await fetchInterlockByLot(response.lote)
            .then((data: any) => {
              if (!data.status) {
                setInterlockData(data);
                setFilledCount(data.count);
                setReadyCount(data.ready);
                setPassAndIgnoreCount(data.passAndIgnore);
                snInputRef.current?.focus();
              } else {
                setInterlockData([]);
                setLotValue("");
              }

              setError(data.message ?? null);
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              setResult("PENDING");
              setError(
                "Erro ao buscar Interlocks por lote. Por favor, verifique o lote e tente novamente."
              );
            });
        } else {
          resetState();
        }
      }

      return response;
    } catch (error: any) {
      console.error("Erro ao lidar com o login do ADM:", error.message);
    }
  };

  const handleLoginAdm = async (formData: AdminInterlockRequest) => {
    try {
      if (formData.status !== "4") {
        formData.matricula = matricula;
        formData.password = password;
      }

      const interlockResponse = await validateAdminInterlock(formData);
      setInterlockData(interlockResponse);

      if (!interlockResponse.status) {
        setFilledCount(interlockResponse.count);
        setReadyCount(interlockResponse.ready);
        setPassAndIgnoreCount(interlockResponse.passAndIgnore);
      }
      return interlockResponse;
    } catch (error: any) {
      console.error("Erro ao lidar com o login do ADM:", error.message);
    }
  };

  const fetchInterlockData = useCallback(
    async (lote: string) => {
      setLoading(true);
      lote = lotValue;
      await fetchInterlockByLot(lote)
        .then((data) => {
          if (!data.status) {
            setInterlockData(data);
            setFilledCount(data.count);
            setReadyCount(data.ready);
            setPassAndIgnoreCount(data.passAndIgnore);
          } else {
            setInterlockData([]);
          }

          setError(data.message ?? null);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setResult("PENDING");
          setError(
            "Erro ao buscar Interlocks por lote. Por favor, verifique o lote e tente novamente."
          );
        });
    },
    [lotValue]
  );

  useEffect(() => {
    lotInputRef.current?.focus();
  }, []);

  const extractValue = async (snValueP: string): Promise<string> => {
    const snValueTrimmed = snValueP.trim();

    let valorExtraido: string;

    if (snValueTrimmed.startsWith("OP")) {
      valorExtraido = snValueTrimmed;
    } else {
      valorExtraido = /(.{8})\(P\)/.test(snValueTrimmed)
        ? snValueTrimmed.match(/(.{8})\(P\)/)?.[1] ?? ""
        : snValueTrimmed.length > 8
        ? snValueTrimmed.slice(-8)
        : snValueTrimmed;
    }

    return valorExtraido;
  };

  const handleSNKeyDown = async (event: any) => {
    try {
      const snValueFormatted = await extractValue(snValue);
      if (event.key == "Tab" && snValue.length >= 8) {
        setSnValueFormatted("");
        setSnValueFormatted(snValueFormatted);
        event.preventDefault();
        const postData: InterlockRequest = {
          user: matricula,
          sn_he: snValueFormatted,
          part_number: partNumberValue,
          lote: lotValue,
        };
        setLotPartDisabled(true);
        setError("");
        if (snValueFormatted != lotValue) {
          const foundData = interlockData?.data?.find(
            (data: InterlockRequest) => data?.sn_he === snValueFormatted
          );

          if (!foundData) {
            setSnValue("");
            return setError(`Serial Number ${snValueFormatted} não encontrado`);
          }

          const existSn = foundData;
          const snResultPass = foundData?.result == "PASS";

          const resetState = () => {
            setError("");
            setSnValue("");
          };

          const updateState = async (response: any) => {
            setResult(
              await response?.data?.find(
                (data: any) => data?.sn_he === snValueFormatted
              )?.result
            );
            setInterlockData(response);
            setFilledCount(response.count);
            setReadyCount(response.ready);
            setPassAndIgnoreCount(response.passAndIgnore);
            setSnValueOld(snValueFormatted);
          };

          if (existSn && snResultPass) {
            resetState();
            if (existSn.status != null) {
              const errorMessage: any = (
                <Typography sx={{ color: "green", fontWeight: "bold" }}>
                  {`Serial Number ${snValueFormatted} já foi validado`}
                </Typography>
              );

              setError(errorMessage);
              setResult(existSn.result);
              setSnValueOld(snValueFormatted);
            } else {
              const response = await validateInterlock(postData);
              updateState(response);
            }
          } else if (existSn) {
            if (existSn.status == 4) {
              resetState();
              setError(`Serial Number ${snValueFormatted} já foi ignorado`);
            } else {
              const getData: any = await fetchInterlockByLot(lotValue);
              const result =
                getData?.data?.find(
                  (data: InterlockRequest) => data?.sn_he === snValueFormatted
                ) ?? null;

              setResult(result.result);
              setSnValueOld(snValueFormatted);

              setInterlockDataModal({
                snValue: snValueFormatted,
                partNumberValue: partNumberValue,
                lotValue: lotValue,
                status:
                  Number(result.status) != 4
                    ? (Number(result.status) + 1).toString()
                    : "4",
                result: result.result,
              });
              setDialogOpen(true);

              resetState();
            }
          } else {
            resetState();
            setError(
              `Serial Number ${snValueFormatted} não encontrado no lote ${lotValue}`
            );
          }
        } else {
          setShowByPassModal(true);
        }
      }
    } catch (error) {
      setError(`Erro ao validar interlock: ${error}`);
      console.error("Erro ao validar interlock:", error);
    }
  };

  const handleKeyUp = async (event: any) => {
    if (event.key == "Tab") {
      setLotValue(event.target.value);
      fetchInterlockData(event.target.value);
    }
  };

  const isReadyToCloseLot = () => {
    if (accessToCloseLot) {
      return true;
    }
    return (
      filledCount === readyCount &&
      passAndIgnoreCount === filledCount &&
      readyCount - passAndIgnoreCount === 0
    );
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        style={{ padding: "90px 32px 32px 32px" }}
      >
        <Grid
          container
          spacing={1}
          style={{
            position: "relative",
            justifyContent: "center",
            marginLeft: 60,
          }}
        >
          {loading && (
            <CircularProgress
              color="info"
              size={30}
              style={{ position: "absolute", top: 20, left: 150 }}
            />
          )}
          <Grid item xs={4}>
            <TextField
              fullWidth
              inputRef={lotInputRef}
              name="lot"
              label="Lote"
              variant="outlined"
              onChange={(e) => setLotValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  handleKeyUp(e);
                }
              }}
              value={lotValue}
              disabled={lotPartDisabled}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              name="part_number"
              label="Part number"
              variant="outlined"
              onChange={(e) => setPartNumberValue(e.target.value)}
              value={partNumberValue}
              disabled={lotPartDisabled}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  if (snInputRef.current) {
                    snInputRef.current.focus();
                  }
                }
              }}
            />
          </Grid>
        </Grid>

        <Grid item xs={5} alignItems="center" justifyContent="center">
          <input
            style={{
              width: "100%",
              padding: "20px 20px",
              margin: "10px 0",
              boxSizing: "border-box",
            }}
            id="interlock"
            name="sn_he"
            placeholder="Serial Number"
            onChange={(e) => setSnValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Tab") {
                handleSNKeyDown(e);
              }
            }}
            value={snValue}
            aria-disabled={snInputRef ? true : false}
            ref={snInputRef}
            disabled={!partNumberValue}
          />
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid
        container
        spacing={4}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={8}>
          <ResultPaper
            serialNumber={snValueOld}
            result={result}
            totalCount={filledCount}
            ready={readyCount}
            passAndIgnore={passAndIgnoreCount}
          />
        </Grid>
        <Grid item xs={8}>
          {interlockData?.data && (
            <ListComponent interlockDataArray={interlockData.data} />
          )}
        </Grid>
      </Grid>
      <DialogComponent
        data={interlockDataModal}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        handleLoginAdm={handleLoginAdm}
      />
      {showLoginDialog && (
        <DialogLogin
          open={showLoginDialog}
          handleUserLogin={handleUserLogin}
          onClose={() => setShowLoginDialog(false)}
        />
      )}
      <ByPassModal
        validateCloseLot={isReadyToCloseLot()}
        open={showByPassModal}
        onClose={() => setShowByPassModal(false)}
        handleByPass={handleByPass}
      />
    </>
  );
};

export default MainPage;
