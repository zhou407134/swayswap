import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { PoolCurrentPosition } from "./PoolCurrentPosition";
import { RemoveLiquidityPreview } from "./RemoveLiquidityPreview";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { CoinInput, useCoinInput } from "~/components/CoinInput";
import { CoinSelector } from "~/components/CoinSelector";
import { NavigateBackButton } from "~/components/NavigateBackButton";
import { CONTRACT_ID, DEADLINE } from "~/config";
import { useContract } from "~/context/AppContext";
import { refreshBalances } from "~/hooks/useBalances";
import coins from "~/lib/CoinsMetadata";
import { ZERO } from "~/lib/math";

export default function RemoveLiquidityPage() {
  const navigate = useNavigate();
  const [errorsRemoveLiquidity, setErrorsRemoveLiquidity] = useState<string[]>(
    []
  );
  const contract = useContract()!;

  const liquidityToken = coins.find((c) => c.assetId === CONTRACT_ID);
  const tokenInput = useCoinInput({
    coin: liquidityToken,
  });
  const amount = tokenInput.amount;

  const removeLiquidityMutation = useMutation(
    async () => {
      if (!amount) {
        throw new Error('"amount" is required');
      }

      // TODO: Add way to set min_eth and min_tokens
      // https://github.com/FuelLabs/swayswap/issues/55
      await contract.submit.remove_liquidity(1, 1, DEADLINE, {
        forward: [amount, CONTRACT_ID],
        variableOutputs: 2,
        gasLimit: 100_000_000,
      });
    },
    {
      onSuccess: () => {
        toast.success("Liquidity removed successfully!");
        tokenInput.setAmount(ZERO);
        navigate("../");
        refreshBalances();
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );

  if (!liquidityToken) {
    return null;
  }

  const validateRemoveLiquidity = () => {
    const errors = [];

    if (!tokenInput.amount) {
      errors.push(`Enter ${liquidityToken.name} amount`);
    }
    if (!tokenInput.hasEnoughBalance) {
      errors.push(`Insufficient ${liquidityToken.name} balance`);
    }

    return errors;
  };

  useEffect(() => {
    setErrorsRemoveLiquidity(validateRemoveLiquidity());
  }, [tokenInput.amount, tokenInput.hasEnoughBalance]);

  const isRemoveButtonDisabled =
    !!errorsRemoveLiquidity.length || removeLiquidityMutation.isLoading;

  const getButtonText = () => {
    if (errorsRemoveLiquidity.length) {
      return errorsRemoveLiquidity[0];
    }

    if (removeLiquidityMutation.isLoading) {
      return "Removing...";
    }

    return "Remove liquidity";
  };

  return (
    <Card>
      <Card.Title>
        <div className="flex items-center">
          <NavigateBackButton />
          Remove Liquidity
        </div>
      </Card.Title>
      <div className="mt-4 mb-4">
        <CoinInput
          autoFocus
          {...tokenInput.getInputProps()}
          rightElement={
            <CoinSelector {...tokenInput.getCoinSelectorProps()} isReadOnly />
          }
        />
      </div>
      <RemoveLiquidityPreview amount={amount} />
      <Button
        isFull
        size="lg"
        variant="primary"
        onPress={
          isRemoveButtonDisabled
            ? undefined
            : () => removeLiquidityMutation.mutate()
        }
        isDisabled={isRemoveButtonDisabled}
      >
        {getButtonText()}
      </Button>
      <div className="mt-8">
        <h3 className="mb-1 mt-5 text-gray-100">Your current positions</h3>
      </div>
      <PoolCurrentPosition />
    </Card>
  );
}